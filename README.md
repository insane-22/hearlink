# HearLink

A whatsapp bot hich makes digital conversations accessible for elders by enabling translation + text-to-speech (voice replies) directly inside WhatsApp. Also helpful for people ho aren't god ith language and have to repeatedly use translater tools.

## Features

- Translate text messages into Hindi language (More languages can be added)
- Convert text into natural voice with Murf AI
- Send back audio replies on WhatsApp
- Easy to use and has simple instructions

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- API keys for third-party services (see below)

### Getting API Keys

#### Twilio API (for WhatsApp)

1. Create a free [Twilio account](https://www.twilio.com/en-us/messaging/channels/whatsapp).
2. Once inside the [dashboard](https://console.twilio.com/), copy your Account SID & Auth Token.

#### Murf API (for TTS & translation)

1. Sign up at [Murf AI](https://murf.ai/api).
2. After logging in, from sidebar go to the [API Keys section](https://murf.ai/api/api-keys).
3. Generate a new API key.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/insane-22/hearlink.git
   cd hearlink
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create .env file using .env.example and fill required details:

   ```bash
   cp .env.example .env
   ```

4. Run server:

   ```bash
   npm start
   ```

5. Since Twilio needs a public URL, expose with ngrok:
   ```bash
   npx ngrok http 3000
   ```
   Copy the HTTPS forwarding URL (e.g. https://abcd1234.ngrok.app).

6. Configure Twilio Sandbox
    - Go to [Twilio Console -> Whatsapp Sandbox](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
    - Set Webhook URL to the one you got from ngrok and add/whatsapp
        ```bash
        https://abcd1234.ngrok.app/whatsapp
        ```

7. Join sandbox by sending the given code to the Twilio WhatsApp number.    