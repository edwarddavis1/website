// Chatbot implementation using Hugging Face Inference API
// This version uses a hosted LLM to generate dynamic responses

// Store your Hugging Face API key - in production, use environment variables
// IMPORTANT: This is a placeholder - you need to get a real key from huggingface.co
const HF_API_KEY = "YOUR_HUGGING_FACE_API_TOKEN"; 

// Knowledge context about Ed to give the model context
const edContext = `
Ed Davis is a PhD researcher in Computational Statistics and Data Science from the University of Bristol.
He specializes in graph embeddings, dynamic networks, and machine learning.

Key research areas:
- Multi-layer graph embeddings
- Dynamic network analysis
- Conformal prediction
- Network bootstrapping

Notable projects:
1. UGNN - A PyTorch implementation of unfolded graph neural networks for multi-network prediction with theoretical guarantees for valid conformal prediction
2. Pyemb - A Python package for exploring complex datasets including high-dimensional data, relational databases, and networks
3. Award-winning data visualizations presented at the Bristol Data and AI Showcase 2022

Publications:
- "Valid Conformal Prediction for Dynamic GNNs" (ICLR 2025)
- "A Simple and Powerful Framework for Stable Dynamic Network Embedding" (JMLR 2024)
- "Valid Bootstraps for Networks with Applications to Network Visualisation" (UAI 2025)

Contact: edwarddavis@hotmail.co.uk, edward.davis@bristol.ac.uk
GitHub: edwarddavis1
LinkedIn: edwarddavis941
`;

// Fallback responses in case API fails
const fallbackResponses = {
    greeting: [
        "Hello! I'm Ed's AI assistant. How can I help you today?",
        "Hi there! I can tell you about Ed's experience, projects, and research. What would you like to know?",
        "Welcome! I'm here to answer questions about Ed Davis. Feel free to ask about his research, projects, or experience!"
    ],
    error: "I'm having trouble connecting to my brain right now. As a fallback, I can tell you that Ed Davis is a PhD researcher specializing in graph embeddings and dynamic networks. You can explore his projects and papers on this website or contact him directly at edwarddavis[at]hotmail.co.uk."
};

// Keyword-based responses for fallback when API is not available
const keywords = {
    greeting: ["hello", "hi", "hey", "greetings", "howdy", "hola"],
    experience: ["experience", "background", "skills", "education", "phd", "expertise", "work"],
    projects: ["project", "application", "tool", "software", "package", "ugnn", "pyemb", "visualization"],
    papers: ["paper", "research", "publication", "journal", "article", "conference", "iclr", "jmlr", "uai"],
    contact: ["contact", "email", "reach", "github", "linkedin", "connect"],
    graph: ["graph", "network", "embedding", "neural network", "gnn", "conformal", "bootstrap"],
    unfolding: ["unfold", "unfolded", "unfolding", "stable", "stability", "jmlr"],
    conformal: ["conformal", "prediction", "uncertainty", "iclr"],
    bootstrap: ["bootstrap", "uncertainty", "visualization", "uai"]
};

// Fallback responses based on keywords
const keywordResponses = {
    experience: "Ed Davis has a PhD in Computational Statistics and Data Science from the University of Bristol. He specializes in graph embeddings, dynamic networks, and machine learning. You can learn more in his <a href='cv.html'>CV</a>.",
    projects: "Ed has developed UGNN (a PyTorch implementation of unfolded graph neural networks) and Pyemb (a Python package for exploring complex datasets). Check out the <a href='#projects'>Projects section</a> for more details!",
    papers: "Ed has published papers on conformal prediction for dynamic GNNs (ICLR 2025), stable dynamic network embedding (JMLR 2024), and bootstrapping for networks (UAI 2025). See the <a href='#papers'>Papers section</a> for more.",
    contact: "You can reach Ed via email at edwarddavis[at]hotmail.co.uk or edward.davis[at]bristol.ac.uk. You can also find him on <a href='https://github.com/edwarddavis1'>GitHub</a> and <a href='https://www.linkedin.com/in/edwarddavis941/'>LinkedIn</a>.",
    graph: "Ed's research focuses on graph embeddings - mathematical representations of networks as vectors. His work on stable dynamic network embeddings has applications in various fields. Learn more in the <a href='#about'>Research Outline</a>.",
    unfolding: "Ed invented a new way of embedding dynamic graphs using a framework called 'unfolding' that extends any graph embedding method to multi-layer graphs with theoretical stability guarantees. See his <a href='https://arxiv.org/abs/2311.09251'>JMLR paper</a> for details.",
    conformal: "Ed's work on conformal prediction for dynamic GNNs provides valid uncertainty quantification for predictions on evolving networks. This has applications in high-risk scenarios. Check out his <a href='https://arxiv.org/abs/2405.19230'>ICLR paper</a>.",
    bootstrap: "Ed developed a novel network bootstrap using k-nearest neighbour smoothing that can generate statistically valid network samples. This helps quantify uncertainty in network visualizations. See his <a href='https://arxiv.org/abs/2410.20895'>UAI paper</a>."
};

// Generate a smart fallback response based on the user's message
function getSmartFallbackResponse(userMessage) {
    const input = userMessage.toLowerCase();
    
    // Check for greetings
    if (keywords.greeting.some(word => input.includes(word))) {
        return fallbackResponses.greeting[Math.floor(Math.random() * fallbackResponses.greeting.length)];
    }
    
    // Build a scoring system for different categories
    const scores = {};
    
    // Initialize scores for each category
    for (const category in keywords) {
        scores[category] = 0;
    }
    
    // Compute scores based on keyword matches
    for (const word of input.split(' ')) {
        for (const category in keywords) {
            if (keywords[category].some(kw => word.includes(kw) || kw.includes(word))) {
                scores[category]++;
            }
        }
    }
    
    // Find the category with the highest score
    let highestScore = 0;
    let bestCategory = null;
    
    for (const category in scores) {
        if (scores[category] > highestScore) {
            highestScore = scores[category];
            bestCategory = category;
        }
    }
    
    // If no clear match is found
    if (highestScore === 0 || bestCategory === 'greeting') {
        return "I'm not sure I understand. You can ask about Ed's experience, projects, papers, or research topics like graph embeddings, conformal prediction, or network bootstrapping.";
    }
    
    // Return the appropriate response
    return keywordResponses[bestCategory] || fallbackResponses.error;
}

// Process text to add HTML links to relevant sections
function processLinks(text) {
    // Convert text references to HTML links
    const linkPatterns = [
        { pattern: /papers section/i, link: "#papers", text: "Papers section" },
        { pattern: /projects section/i, link: "#projects", text: "Projects section" },
        { pattern: /contact/i, link: "#contact", text: "Contact section" },
        { pattern: /research outline/i, link: "#about", text: "Research Outline" },
        { pattern: /CV|curriculum vitae/i, link: "cv.html", text: "CV" },
        { pattern: /UGNN|unfolded graph neural networks/i, link: "https://github.com/edwarddavis1/ugnn", text: "UGNN project" },
        { pattern: /pyemb/i, link: "https://github.com/pyemb/pyemb", text: "pyemb package" },
        { pattern: /ICLR paper|conformal prediction/i, link: "https://arxiv.org/abs/2405.19230", text: "ICLR paper" },
        { pattern: /JMLR paper|stable dynamic network/i, link: "https://arxiv.org/abs/2311.09251", text: "JMLR paper" },
        { pattern: /UAI paper|bootstrap/i, link: "https://arxiv.org/abs/2410.20895", text: "UAI paper" }
    ];
    
    let processedText = text;
    
    linkPatterns.forEach(({ pattern, link, text: linkText }) => {
        processedText = processedText.replace(pattern, `<a href="${link}">${linkText}</a>`);
    });
    
    return processedText;
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

// Function to provide helpful information when Hugging Face API key is not set
function showApiKeyInstructions() {
    console.log(`
    =======================================================
    To enable the Hugging Face LLM integration:
    
    1. Sign up for a free account at huggingface.co
    2. Go to https://huggingface.co/settings/tokens to create an API token
    3. Replace YOUR_HUGGING_FACE_API_TOKEN in the chatbot-llm.js file with your actual token
    
    Note: Using the Hugging Face Inference API may incur costs depending on your usage.
    Free tier is available for limited usage.
    =======================================================
    `);
}

// Show API key instructions in console on page load
document.addEventListener('DOMContentLoaded', function() {
    if (HF_API_KEY === "YOUR_HUGGING_FACE_API_TOKEN") {
        showApiKeyInstructions();
    }
});

// Create chatbot HTML elements
function createChatbotElements() {
    const chatbotHTML = `
        <div id="chatbot-toggle">
            <i class="fas fa-robot"></i>
        </div>
        <div id="chatbot-container" class="hidden">
            <div id="chatbot-header">
                <h3>AI Assistant (LLM-powered)</h3>
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
        addBotMessage(fallbackResponses.greeting[0]);
    }
}

// Send a user message
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;
    
    // Add user message to chat
    addUserMessage(userMessage);
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Get response from LLM
        const response = await getResponseFromLLM(userMessage);
        
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Add bot response
        addBotMessage(response);
    } catch (error) {
        console.error("Error getting response from LLM:", error);
        
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        // Add fallback response
        addBotMessage(fallbackResponses.error);
    }
}

// Get response from Hugging Face LLM API
async function getResponseFromLLM(userMessage) {
    // Check if API key is set
    if (HF_API_KEY === "YOUR_HUGGING_FACE_API_TOKEN") {
        console.warn("No Hugging Face API key provided. Using fallback response.");
        return getSmartFallbackResponse(userMessage);
    }
    
    // Prepare the prompt with context
    const prompt = `
Context about Ed Davis:
${edContext}

You are Ed Davis's AI assistant on his portfolio website. You should be helpful, friendly, and enthusiastic about Ed's work.
Always respond in a concise manner, limited to 2-3 sentences maximum.
Include relevant links to sections of the website when appropriate (#papers, #projects, #contact, etc.)

User query: ${userMessage}
`;

    try {
        // Make API request to Hugging Face Inference API
        // Using the text-generation endpoint with a suitable model
        const response = await fetch(
            "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf", // You can change the model
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 150, // Limit response length
                        temperature: 0.7,    // Control randomness (higher = more random)
                        top_p: 0.9,          // Nucleus sampling
                        do_sample: true      // Enable sampling
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();
        
        // Extract the generated text from the response
        // The exact structure depends on the model used
        let generatedText = result[0]?.generated_text || "";
        
        // Clean up the response
        generatedText = generatedText.replace(prompt, "").trim();
        
        // Process links to sections (convert text like "See Projects section" to actual links)
        generatedText = processLinks(generatedText);
        
        return generatedText || getSmartFallbackResponse(userMessage);
    } catch (error) {
        console.error("Error calling Hugging Face API:", error);
        return getSmartFallbackResponse(userMessage);
    }
}
