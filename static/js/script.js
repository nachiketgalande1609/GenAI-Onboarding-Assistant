/*
    Author: Nachiket Galande
    Date: March 1, 2024
*/

let messageInput = document.getElementById('message_input');
let messageForm = document.getElementById('message_input_form');
let messagesDiv = document.getElementById('messages');

let doc_list = []

function fetchFileNames() {
    fetch('/get_filenames')
        .then(response => response.json())
        .then(data => doc_list.push(...data))
        .catch(error => console.error('Error:', error));
}
fetchFileNames();

// Print the timeout message
const questions = [
    "What is the eligibility criteria for state pension and pension credit?",
    "Which button should I click to create a new RM case?",
    "What is the standard rate of carer's allowance?"
];
function generateQuestionHTML(question) {
    return `<a class="btn btn-primary time-out-questions" onclick="ask_questions('${question}')" href="#">${question}</a><br>`;
}
const questionsHTML = questions.map(generateQuestionHTML).join('');
const timeout_msg = `
    You have been quiet. Do you want me to help you with the following?<br>
    ${questionsHTML}`;

let timeoutId;

// Print the welcome message
window.onload = function () {
    setTimeout(() => createMessageBlock(`Hello, Welcome aboard! My name is <strong class="p-0" style="color: #7618C1;">W.I.S.E</strong>. I am your onboarding assistant.<br>I'm here to assist you with any questions you have. Feel free to ask anything!`, 'other'), 500);
};

// Start standby timer
function startTimer(timeoutSeconds, onTimeoutCallback) {
    timeoutId = setTimeout(() => {
        onTimeoutCallback();
    }, timeoutSeconds * 1000); // Convert seconds to milliseconds
}

// Reset standby timer
function resetTimer(timeoutSeconds, onTimeoutCallback) {
    clearTimeout(timeoutId); // Clear the existing timer
    startTimer(timeoutSeconds, onTimeoutCallback); // Restart the timer
}

// Stop standby timer
function stopTimer() {
    clearTimeout(timeoutId); // Clear the timer
}

// Print message after timeout
function onTimeout() {
    // createMessageBlock('Going on StandyBy', 'other');
    createMessageBlock(timeout_msg, 'other')
    firstElement.addEventListener('click', function () {
        summarize_doc(documentName);
    });
    messageCard.style.paddingBottom = '10px';
}

// Send message from textbox and get response
messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var attachButton = document.querySelector('.btn-paperclip');
    attachButton.classList.remove('attached-file');
    var removeAttachmentButton = document.querySelector('#removeAttachmentButton');
    removeAttachmentButton.style.display = "none"

    // Get the message and file input values
    let message = messageInput.value.trim();
    let fileInput = document.getElementById('file_input');
    let file = fileInput.files[0];

    if (message.length > 0 || file) {
        if (file) {
            const messageBlock = createMessageBlock(`${message}<br><small class="filename">File Attached: ${file.name}</small>`, 'self');
        }
        else {
            const messageBlock = createMessageBlock(message, 'self');
        }
        showLoading();
        messageInput.value = '';

        // Create FormData object to send both text and file
        let formData = new FormData();
        formData.append('message', message);
        if (file) {
            formData.append('attachment', file);
        }

        fetch('/get_response', {
            method: 'POST',
            body: formData,  // Use FormData instead of JSON.stringify
        })
            .then(response => response.json())
            .then(data => {
                const responseBlock = createMessageBlock(data.response, 'other');
                messagesDiv.appendChild(responseBlock);
                hideLoading();
            })
            .catch(error => console.error('Error:', error));

        // Reset the file input value
        fileInput.value = '';
        resetTimer(90, onTimeout);
    }
});

// Create messsage block function
function createMessageBlock(message, username) {
    // Hide document reference from the OpenAI response

    if (username === "self") {
        message = message.replace(/\[doc\d+\]/g, '');
        var currentDate = new Date();
        var time = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });


        const messagesDiv = document.getElementById('messages');
        const messageBlock = document.createElement('div');
        const messageCard = document.createElement('div');
        const messageCardBody = document.createElement('div');
        const messageTimestamp = document.createElement('div');
        const profileImage = document.createElement('img');
        profileImage.width = '50';
        profileImage.height = '50';
        profileImage.style.borderRadius = '25px';


        messageCardBody.classList.add('card-body');
        messageCardBody.innerHTML = message;
        messageTimestamp.innerHTML = `<small>` + time + `</small>`;
        messageTimestamp.classList.add('message-timestamp');

        messageCard.appendChild(messageCardBody);
        messageCardBody.appendChild(messageTimestamp);
        messageBlock.appendChild(messageCard);
        messagesDiv.appendChild(messageBlock);
        profileImage.src = `../static/images/user.png`;
        messageBlock.classList.add('d-flex', 'justify-content-end', 'message-block', 'mb-3');
        messageCard.classList.add('card', 'message-card-self', 'bg-success', 'text-white');
        messageBlock.appendChild(profileImage);
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight);

        if ((message.startsWith('Hello, Welcome aboard!') || message.includes('You have been quiet. Do you want me to help you with the following?')) && username === "other") {
            addsummarizationlist(messageCard);
        }
        return messageBlock;
    } else {
        setTimeout(() => {
            message = message.replace(/\[doc\d+\]/g, '');
            var currentDate = new Date();
            var time = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });


            const messagesDiv = document.getElementById('messages');
            const messageBlock = document.createElement('div');
            const messageCard = document.createElement('div');
            const messageCardBody = document.createElement('div');
            const messageTimestamp = document.createElement('div');
            const profileImage = document.createElement('img');
            profileImage.width = '50';
            profileImage.height = '50';
            profileImage.style.borderRadius = '25px';


            messageCardBody.classList.add('card-body');
            messageCardBody.innerHTML = message;
            messageTimestamp.innerHTML = `<small>` + time + `</small>`;
            messageTimestamp.classList.add('message-timestamp');

            messageCard.appendChild(messageCardBody);
            messageCardBody.appendChild(messageTimestamp);
            messageBlock.appendChild(messageCard);
            messagesDiv.appendChild(messageBlock);
            if (message.startsWith("Error:")) {
                stopTimer();
            }
            profileImage.src = `../static/images/bot.png`;
            messageBlock.classList.add('d-flex', 'message-block', 'mb-3');
            messageCard.classList.add('card', 'message-card', 'bg-light');
            messageBlock.insertBefore(profileImage, messageBlock.firstChild);
            document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight);

            if ((message.startsWith('Hello, Welcome aboard!') || message.includes('You have been quiet. Do you want me to help you with the following?')) && username === "other") {
                addsummarizationlist(messageCard);
            }
            hideLoading();
            return messageBlock;
        }, 2000);


    }

};

// Attach document names to the response
function addsummarizationlist(messageCard) {
    var hr = document.createElement('hr');
    var text = document.createElement('strong');
    var text_div = document.createElement('div');
    var arrow = document.createElement('strong');
    arrow.style.padding = '0';
    arrow.innerHTML = '<i class="bi bi-caret-down-fill"></i>';
    text.classList.add('accordion-button', 'pb-0');
    text_div.setAttribute('type', 'button');
    text_div.setAttribute('data-bs-toggle', 'collapse');
    text_div.setAttribute('data-bs-target', '#collapseOne');
    text_div.setAttribute('aria-expanded', 'true');
    text_div.setAttribute('aria-controls', 'collapseOne');
    text_div.classList.add('flex', 'flex-column', 'text-center');
    text.innerHTML = 'Expand this to view the document list. Click on any document you wish to summarize';
    const div = document.createElement('div')
    div.classList.add('accordion-collapse', 'collapse');
    div.setAttribute('id', 'collapseOne');
    div.setAttribute('data-bs-parent', '#accordionExample')
    messageCard.appendChild(hr);
    text_div.appendChild(text);
    text_div.appendChild(arrow);
    messageCard.appendChild(text_div);
    messageCard.appendChild(div);

    acc_div = document.createElement('div');
    acc_div.classList.add('d-flex', 'flex-column', 'accordion-body');
    div.appendChild(acc_div);
    doc_list.forEach(function (documentName) {
        var doc_button = document.createElement('a');
        doc_button.setAttribute('class', 'btn btn-primary doc-link');
        doc_button.setAttribute('target', '_blank');
        doc_button.innerHTML = documentName;
        doc_button.addEventListener('click', function () {
            summarize_doc(documentName);
        });
        acc_div.appendChild(doc_button);
    });
    messageCard.style.paddingBottom = '10px';

    text_div.addEventListener('click', function () {
        if (arrow.innerHTML.includes('bi-caret-down-fill')) {
            arrow.innerHTML = '<i class="bi bi-caret-up-fill"></i>';
        } else {
            arrow.innerHTML = '<i class="bi bi-caret-down-fill"></i>';
        }
    });
}

// Invoke python function to send the document name in a prompt to OpenAI API to get summary
function summarize_doc(documentName) {
    prompt = "Summarize '" + documentName + "' document";
    createMessageBlock(prompt, 'self');
    showLoading();
    const endpoint = '/summarize_doc';
    const requestData = {
        documentName: documentName
    };
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            createMessageBlock(data.response, 'other');
            if (!data.response.startsWith("Error: ")) {
                createMessageBlock(`Here is a link to the document <a class="btn btn-primary doc-link" href="../static/documents/${documentName}">${documentName}</a><br>If you have any other questions, feel free to ask!`)
            }
            hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    resetTimer(90, onTimeout);
}

// Function to ask questions to user on timeout
function ask_questions(prompt) {
    createMessageBlock(prompt, 'self');
    showLoading();
    const endpoint = '/ask_questions';
    const requestData = {
        question: prompt
    };
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            createMessageBlock(data.response, 'other');
            hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    resetTimer(90, onTimeout);
}

// Show loading icon
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';

    const img = document.createElement('img');
    img.src = '../static/images/loading.gif';
    img.alt = 'Loading...';
    img.style.width = '40px';

    loadingDiv.appendChild(img);
    document.getElementById('messages').appendChild(loadingDiv);
}

// Hide loading icon
function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
}

// Display attached filename
function displayFileName() {
    var fileInput = document.getElementById('file_input');
    var attachButton = document.querySelector('.btn-paperclip');
    var removeAttachmentButton = document.querySelector('#removeAttachmentButton');

    if (fileInput.files.length > 0) {
        // File is attached, add the attached-file class to the button
        attachButton.classList.add('attached-file');
        removeAttachmentButton.style.display = 'Block'
    } else {
        // No file attached, remove the attached-file class from the button
        attachButton.classList.remove('attached-file');
        removeAttachmentButton.style.display = 'None'
    }
}

// Remove attached file
function removeAttachment() {
    var fileInput = document.getElementById('file_input');
    var attachButton = document.querySelector('.btn-paperclip');
    var removeAttachmentButton = document.querySelector('#removeAttachmentButton');
    attachButton.classList.remove('attached-file');
    fileInput.value = ''; // Clear the file input
    removeAttachmentButton.style.display = 'none';
}

// Function to simulate typing effect
// function typeText(element, text, speed) {
//     let i = 0;
//     const typingInterval = setInterval(() => {
//         element.innerHTML += text.charAt(i);
//         i++;
//         if (i === text.length) {
//             clearInterval(typingInterval);
//         }
//     }, speed);
// }
// typeText(messageCardBody, message, 50); // Adjust speed as needed

function startSpeechRecognition() {

    const micButton = document.getElementById('mic_button');
    const micIcon = document.getElementById('mic_icon');
    micButton.classList.add('listening');

    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US'; // Change to your desired language
    recognition.interimResults = true;

    recognition.interimTranscript = '';
    recognition.onresult = function (event) {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                recognition.interimTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        const textBox = document.getElementById('message_input');
        textBox.value = recognition.interimTranscript + interimTranscript;
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function () {
        console.log('Speech recognition ended.');
        micButton.classList.remove('listening');
    };

    recognition.start();
}