"""
Author: Nachiket Galande
Date: March 1, 2024
"""

from flask import Flask, render_template, jsonify, request
from openai import AzureOpenAI
from config import API_KEY, AZURE_ENDPOINT, MODEL, API_VERSION, SEARCH_ENDPOINT, SEARCH_KEY, INDEX_NAME
from markdown import markdown
from werkzeug.utils import secure_filename  # For secure filename handling
from docx import Document
import os

# Initialize Flask app
app = Flask(__name__)

endpoint = AZURE_ENDPOINT
deployment = MODEL

# Create an instance of AzureOpenAI class for OpenAI API interaction
client = AzureOpenAI(
    base_url=f"{endpoint}/openai/deployments/{deployment}/extensions",
    api_key=API_KEY,
    api_version=API_VERSION
)

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

doc_num = 1
def generate_response(prompt):
    global doc_num
    with open(f"response{doc_num}.txt", "r") as file:
        # Read the contents of the file
        content = file.readlines()

        # Convert content to HTML with bullet points
        html_response = "<ul>"
        for line in content:
            # Check if the line starts with a hyphen
            if line.strip().startswith('-'):
                html_response += "<li>{}</li>".format(line.strip()[1:].strip())
            else:
                # If it doesn't start with a hyphen, just add the line
                html_response += "{}<br>".format(line.strip())

        html_response += "</ul>"
        doc_num += 1
    return html_response

# def generate_response(prompt):
#     messages = [
#         {"role": "user","content": prompt}
#     ]

#     try:
#         # Send the conversation prompt to OpenAI for generating a response
#         result = client.chat.completions.create(
#                 messages=messages,
#                 model=deployment,
#                 temperature=0,
#                 max_tokens=1000,
#                 extra_body={
#                     "dataSources": [
#                         {
#                             "type": "AzureCognitiveSearch",
#                             "parameters": {
#                                 "endpoint": SEARCH_ENDPOINT,
#                                 "key": SEARCH_KEY,
#                                 "indexName": INDEX_NAME,
#                                 "roleInformation": "Your role is to summarize the indexed documents",
#                                 "strictness": 3,
#                                 "topNDocuments": 5,
#                             }
#                         }
#                     ]
#                 }
#             )
#         response = result.choices[0].message.content
#         html_response = markdown(response)
#     except Exception as e:
#         html_response = "Error: " + str(e)
#     return html_response

def read_word_file(file_path):
    doc = Document(file_path)
    # Initialize an empty string to store the text
    text_content = ""
    # Iterate through paragraphs in the document
    for paragraph in doc.paragraphs:
        text_content += paragraph.text + "\n"

    return text_content

@app.route('/get_response', methods=['POST'])
def get_response():
    # Get text data from the request
    prompt = request.form.get('message')
    # Check if there's an attached file
    if 'attachment' in request.files:
        attachment = request.files['attachment']
        filename = secure_filename(attachment.filename)     # Save the attached file to a temporary location
        file_path = f'temporary_directory/{filename}'
        attachment.save(file_path)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:       # Read the contents of the file and use it as the message
            if filename.endswith('.docx'):          # Check if file is .docx
                file_contents = read_word_file(file_path)
            else:
                file_contents = file.read()

        # Update the message with the file contents
        prompt = f"{prompt}\n\nFile Contents:\n{file_contents}"

    html_response = generate_response(prompt)
    html_response = markdown(html_response)
    # Return the AI-generated response as JSON
    return jsonify({'response': html_response})

@app.route('/summarize_doc', methods=['POST'])
def summarize_doc():
    document_name = request.json.get('documentName')

    # prompt = "Summarize " + document_name + " document"
    prompt = "Generate a concise summary of the" + document_name + "document in bullet points, highlighting key information"
    html_response = generate_response(prompt)
    return jsonify({'response': html_response})

@app.route('/ask_questions', methods=['POST'])
def ask_questions():
    prompt = request.json.get('question')
    html_response = generate_response(prompt)
    return jsonify({'response': html_response})

@app.route('/get_filenames')
def get_filenames():
    directory = './static/documents'
    file_names = os.listdir(directory)    
    return jsonify(file_names)

if __name__ == '__main__':
    app.run(debug=True)
