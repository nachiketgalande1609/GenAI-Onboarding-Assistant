# Gen AI Conversational Assistant

This repository contains the code for a Gen AI conversational assistant developed and deployed using Flask and OpenAI GPT-3.5 deployed on Azure. 
The assistant is designed to facilitate project knowledge transfer for new resources, ensuring efficient onboarding and knowledge sharing.

## Key Features

### Document Summarization
- **Purpose**: Streamlines onboarding by providing precise summaries.
- **Benefit**: Saves time and enhances productivity by quickly familiarizing new resources with essential project information.

### Advanced QA
- **Purpose**: Provides efficient, document-specific question-answering.
- **Implementation**: Integrated with Azure Storage and Search Service.
- **Benefit**: Enables quick retrieval of relevant information from project documents.

### Proactive Suggestions
- **Purpose**: Guides user actions during periods of inactivity.
- **Benefit**: Optimizes engagement and ensures continuous interaction.

## Tech Stack

### Backend
- **Framework**: Flask
- **Libraries**: 
  - OpenAI’s Python library for integrating GPT-3.5
  - pyttsx3 for speech-to-text support

### Frontend
- **Technologies**: 
  - Vanilla JavaScript
  - Bootstrap

### Communication
- **API**: OpenAI’s REST API for interaction with GPT-3.5

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Flask
- OpenAI Python Library
- pyttsx3
- Azure Storage and Search Service credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dwp-gen-ai-assistant.git
   cd dwp-gen-ai-assistant
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your environment variables for Azure and OpenAI credentials:
   ```bash
   export AZURE_STORAGE_ACCOUNT_NAME='your_account_name'
   export AZURE_STORAGE_ACCOUNT_KEY='your_account_key'
   export OPENAI_API_KEY='your_openai_api_key'
   ```

### Running the Application

1. Start the Flask server:
   ```bash
   flask run
   ```

2. Open your web browser and navigate to `http://localhost:5000` to interact with the assistant.

## Usage

- **Document Summarization**: Upload a document, and the assistant will provide a concise summary.
- **Advanced QA**: Ask questions related to the uploaded documents, and the assistant will retrieve specific information.
- **Proactive Suggestions**: Stay engaged with the assistant’s proactive suggestions during idle periods.

## Contributing

We welcome contributions to improve this project. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [OpenAI](https://www.openai.com/) for providing the GPT-3.5 API.
- [Azure](https://azure.microsoft.com/) for storage and search services.
- [pyttsx3](https://pypi.org/project/pyttsx3/) for speech-to-text functionality.
