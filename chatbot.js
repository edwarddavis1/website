// Chatbot implementation for Ed Davis's portfolio website

// Knowledge base with information about Ed's experience, projects, and papers
const knowledgeBase = {
    greeting: [
        "Hello! I'm Ed's virtual assistant. How can I help you today?",
        "Hi there! I can tell you about Ed's experience, projects, and research. What would you like to know?",
        "Welcome! I'm here to answer questions about Ed Davis. Feel free to ask about his research, projects, or experience!"
    ],
    experience: {
        general: "Ed Davis has a PhD in Computational Statistics and Data Science from the University of Bristol. He specializes in graph embeddings, dynamic networks, and machine learning.",
        skills: "Ed's technical skills include Python, PyTorch, data science, statistical modeling, network analysis, graph neural networks, and AI engineering.",
        research: "Ed's research focuses on multi-layer graph embeddings, with applications in dynamic networks, conformal prediction, and bootstrapping methods."
    },
    projects: {
        ugnn: "UGNN is Ed's PyTorch implementation of unfolded graph neural networks for multi-network prediction. It provides theoretical guarantees for valid conformal prediction, allowing for uncertainty quantification in predictions.",
        pyemb: "Pyemb is a Python package for exploring complex datasets including high-dimensional data, relational databases, and networks. It makes it easy to compute dynamic embeddings and create interactive visualizations.",
        visualization: "Ed has created award-winning data visualizations, including a visualization of country alliances that was presented at the Bristol Data and AI Showcase 2022."
    },
    papers: {
        conformal: "Valid Conformal Prediction for Dynamic GNNs (ICLR 2025) extends the validity of conformal prediction to dynamic graph neural networks, enabling uncertainty quantification in both transductive and semi-inductive regimes.",
        framework: "A Simple and Powerful Framework for Stable Dynamic Network Embedding (JMLR 2024) introduces a new approach to represent nodes in dynamic networks as evolving vectors, with theoretical guarantees of stability.",
        bootstrap: "Valid Bootstraps for Networks with Applications to Network Visualisation (UAI 2025) addresses the challenge of bootstrapping inhomogeneous random graphs to quantify uncertainty in network visualizations."
    },
    contact: "You can contact Ed via email at edwarddavis[at]hotmail.co.uk or edward.davis[at]bristol.ac.uk. You can also find him on GitHub (edwarddavis1) and LinkedIn (edwarddavis941)."
};

// Keywords to match in user queries
const keywords = {
    greeting: ["hello", "hi", "hey", "greetings", "howdy", "hola"],
    experience: ["experience", "background", "skills", "education", "phd", "expertise", "work"],
    projects: ["project", "application", "tool", "software", "package", "ugnn", "pyemb", "visualization"],
    papers: ["paper", "research", "publication", "journal", "article", "conference", "iclr", "jmlr", "uai"],
    contact: ["contact", "email", "reach", "github", "linkedin", "connect"]
};

// Function to find the best matching response based on user input
function findResponse(userInput) {
    const input = userInput.toLowerCase();
    
    // Check for greetings
    if (keywords.greeting.some(word => input.includes(word))) {
        return {
            type: 'greeting',
            text: knowledgeBase.greeting[Math.floor(Math.random() * knowledgeBase.greeting.length)]
        };
    }
    
    // Build a scoring system for different categories
    const scores = {
        experience: 0,
        projects: 0,
        papers: 0,
        contact: 0
    };
    
    // Compute scores based on keyword matches
    for (const word of input.split(' ')) {
        if (keywords.experience.some(kw => word.includes(kw) || kw.includes(word))) scores.experience++;
        if (keywords.projects.some(kw => word.includes(kw) || kw.includes(word))) scores.projects++;
        if (keywords.papers.some(kw => word.includes(kw) || kw.includes(word))) scores.papers++;
        if (keywords.contact.some(kw => word.includes(kw) || kw.includes(word))) scores.contact++;
    }
    
    // Specific project matches
    if (input.includes("ugnn") || input.includes("graph neural") || input.includes("uncertainty")) {
        return {
            type: 'projects',
            text: knowledgeBase.projects.ugnn,
            link: "#projects",
            linkText: "View UGNN Project"
        };
    }
    
    if (input.includes("pyemb") || input.includes("embedding package") || input.includes("visualization tool")) {
        return {
            type: 'projects',
            text: knowledgeBase.projects.pyemb,
            link: "#projects",
            linkText: "View Pyemb Project"
        };
    }
    
    // Specific paper matches
    if (input.includes("conformal") || input.includes("prediction") || input.includes("iclr")) {
        return {
            type: 'papers',
            text: knowledgeBase.papers.conformal,
            link: "https://arxiv.org/abs/2405.19230",
            linkText: "Read the paper"
        };
    }
    
    if (input.includes("framework") || input.includes("stable") || input.includes("jmlr")) {
        return {
            type: 'papers',
            text: knowledgeBase.papers.framework,
            link: "https://arxiv.org/abs/2311.09251",
            linkText: "Read the paper"
        };
    }
    
    if (input.includes("bootstrap") || input.includes("network visualization") || input.includes("uai")) {
        return {
            type: 'papers',
            text: knowledgeBase.papers.bootstrap,
            link: "https://arxiv.org/abs/2410.20895",
            linkText: "Read the paper"
        };
    }
    
    // Find the category with the highest score
    let highestScore = 0;
    let bestCategory = 'experience'; // Default category
    
    for (const category in scores) {
        if (scores[category] > highestScore) {
            highestScore = scores[category];
            bestCategory = category;
        }
    }
    
    // If no clear match is found
    if (highestScore === 0) {
        return {
            type: 'general',
            text: "I'm not sure I understand. You can ask about Ed's experience, projects, papers, or contact information. For example, 'Tell me about Ed's projects' or 'What papers has Ed published?'"
        };
    }
    
    // Return the appropriate response
    switch (bestCategory) {
        case 'experience':
            return {
                type: 'experience',
                text: knowledgeBase.experience.general,
                link: "cv.html",
                linkText: "View Full CV"
            };
        case 'projects':
            return {
                type: 'projects',
                text: `Ed has worked on several projects including UGNN (unfolded graph neural networks) and Pyemb (a Python package for exploring complex datasets).`,
                link: "#projects",
                linkText: "View All Projects"
            };
        case 'papers':
            return {
                type: 'papers',
                text: `Ed has published papers on conformal prediction for dynamic GNNs, stable dynamic network embedding, and bootstrapping for networks.`,
                link: "#papers",
                linkText: "View All Papers"
            };
        case 'contact':
            return {
                type: 'contact',
                text: knowledgeBase.contact,
                link: "#contact",
                linkText: "Contact Information"
            };
    }
}

// DOM elements
let chatbotToggle;
let chatbotContainer;
let chatMessages;
let chatInput;
let sendButton;

// Initialize chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create the chatbot elements if they don't exist
    if (!document.getElementById('chatbot-container')) {
        createChatbotElements();
    }
    
    // Set up DOM references
    chatbotToggle = document.getElementById('chatbot-toggle');
    chatbotContainer = document.getElementById('chatbot-container');
    chatMessages = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');
    sendButton = document.getElementById('send-button');
    
    // Add a small delay before showing the chatbot toggle button with animation
    setTimeout(() => {
        chatbotToggle.style.opacity = '0';
        chatbotToggle.style.display = 'flex';
        setTimeout(() => {
            chatbotToggle.style.opacity = '1';
            chatbotToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                chatbotToggle.style.transform = 'scale(1)';
            }, 200);
        }, 100);
    }, 2000);
    
    // Add event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Display initial greeting
    setTimeout(() => {
        addBotMessage(knowledgeBase.greeting[0]);
    }, 1000);
});

// Create chatbot HTML elements
function createChatbotElements() {
    const chatbotHTML = `
        <div id="chatbot-toggle">
            <i class="fas fa-robot"></i>
        </div>
        <div id="chatbot-container" class="hidden">
            <div id="chatbot-header">
                <h3>AI Assistant</h3>
                <button id="close-chatbot"><i class="fas fa-times"></i></button>
            </div>
            <div id="chat-messages"></div>
            <div id="chat-input-container">
                <input type="text" id="chat-input" placeholder="Ask me about Ed's experience, projects, or research...">
                <button id="send-button"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    const chatbotDiv = document.createElement('div');
    chatbotDiv.id = 'chatbot';
    chatbotDiv.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotDiv);
    
    // Add close button functionality
    document.getElementById('close-chatbot').addEventListener('click', toggleChatbot);
}

// Toggle chatbot visibility
function toggleChatbot() {
    chatbotContainer.classList.toggle('hidden');
    
    // If opening the chatbot and there are no messages, add the initial greeting
    if (!chatbotContainer.classList.contains('hidden') && chatMessages.childNodes.length === 0) {
        addBotMessage(knowledgeBase.greeting[0]);
    }
}

// Send a user message
function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;
    
    // Add user message to chat
    addUserMessage(userMessage);
    chatInput.value = '';
    
    // Simulate bot "thinking"
    setTimeout(() => {
        const response = findResponse(userMessage);
        let botMessage = response.text;
        
        // Add a link if available
        if (response.link && response.linkText) {
            botMessage += `<br><br><a href="${response.link}" class="chatbot-link">${response.linkText}</a>`;
        }
        
        addBotMessage(botMessage);
    }, 1000);
}

// Add a user message to the chat
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add a bot message to the chat
function addBotMessage(html) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerHTML = html;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Make links in chatbot work
    const links = messageDiv.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            chatbotContainer.classList.add('hidden');
        });
    });
}
