# LLM-Powered Chatbot for Portfolio Website

This repository contains a Hugging Face LLM-powered chatbot implementation for Ed Davis's portfolio website.

## Features

- **Hugging Face Integration**: Connects to Hugging Face's Inference API to use state-of-the-art language models
- **Context-Aware Responses**: Provides the LLM with context about Ed's research, projects, and skills
- **Smart Fallbacks**: Falls back to keyword-based responses if the API is unavailable
- **Responsive Design**: Works on all device sizes with a clean, modern interface
- **Typing Indicators**: Shows a realistic typing animation while waiting for the LLM response
- **Link Processing**: Automatically converts text references to clickable links to website sections

## Setup Instructions

1. **Get a Hugging Face API Key**:
   - Sign up for a free account at [huggingface.co](https://huggingface.co)
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) to create an API token

2. **Update the API Key**:
   - Open `chatbot-llm.js`
   - Replace `YOUR_HUGGING_FACE_API_TOKEN` with your actual token:
   ```javascript
   const HF_API_KEY = "YOUR_HUGGING_FACE_API_TOKEN"; // Replace with your actual token
   ```

3. **Include in Your HTML**:
   ```html
   <!-- Include Font Awesome for icons -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
   
   <!-- Include the chatbot CSS and JS -->
   <link rel="stylesheet" href="chatbot-llm.css">
   <script src="chatbot-llm.js"></script>
   ```

## Customization

### Change the Model

You can change the Hugging Face model being used by modifying the URL in the `getResponseFromLLM` function:

```javascript
const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf", // Change model here
    // ...
);
```

### Modify the Context

You can update the context provided to the model by editing the `edContext` constant:

```javascript
const edContext = `
// Your context here
`;
```

### Styling

The chatbot's appearance can be customized by modifying the `chatbot-llm.css` file.

## Usage Limits

The free tier of Hugging Face's Inference API has usage limits. For high-traffic websites, you may need to upgrade to a paid plan.

## Demo

A demo is available in `llm-chatbot-demo.html` which shows the chatbot in action and provides implementation details.

## License

MIT License
