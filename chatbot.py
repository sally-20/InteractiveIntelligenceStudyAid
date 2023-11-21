import os
import importlib
import openai

openai.api_key = os.getenv('OPENAI_API_KEY')

def initialize_messages() -> list:
    """Initialize the chat messages with system and user messages."""
    return [
        {"role": "system", "content": "You’re a kind helpful assistant, who only responds with the knowledge you know for sure, don't hallucinate information."},
        {"role": "user", "content": "Your only knowledge is about the subjects algorithms, personal finance, and calculus "}
    ]

def get_user_input() -> str:
    """Get user input from the command line."""
    return input("User: ")

def add_message(messages: list, role: str, content: str):
    """Add a message to the list of chat messages."""
    messages.append({"role": role, "content": content})

def generate_chat_response(messages: list) -> str:
    """Generate a chat response using the OpenAI API."""
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    return completion.choices[0].message.content

def main():
    messages = initialize_messages()

    while True:
        user_message = get_user_input()
        add_message(messages, "user", user_message)

        chat_response = generate_chat_response(messages)
        print(f'ChatGPT: {chat_response}')
        add_message(messages, "assistant", chat_response)

if __name__ == '__main__':
    main()
