import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { convertHtmlToPptx } from './engine/converter.js';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve the engine directory for frontend extractor access
app.use('/engine', express.static(path.join(__dirname, 'engine')));

// Serve main interface
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML-to-PPTX Slide Engine</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: #151d30;
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --border: #24324f;
            --success: #10b981;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 950px;
            padding: 40px 20px;
            box-sizing: border-box;
        }

        header {
            text-align: center;
            margin-bottom: 35px;
        }

        h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin: 0 0 10px 0;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
        }

        header p {
            color: var(--text-secondary);
            font-size: 1.15rem;
            margin: 0;
            font-weight: 300;
        }

        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 35px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            font-weight: 500;
            margin-bottom: 10px;
            color: var(--text-primary);
            font-size: 1rem;
        }

        textarea {
            width: 100%;
            height: 400px;
            background-color: #080b12;
            border: 1px solid var(--border);
            border-radius: 10px;
            color: #34d399; /* elegant green code */
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9rem;
            line-height: 1.5;
            padding: 20px;
            box-sizing: border-box;
            resize: vertical;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        textarea:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        button {
            background-color: var(--accent);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 16px 30px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        button:hover {
            background-color: var(--accent-hover);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        button:active {
            transform: scale(0.99);
        }

        button:disabled {
            background-color: var(--border);
            color: var(--text-secondary);
            cursor: not-allowed;
            box-shadow: none;
        }

        .status {
            margin-top: 20px;
            padding: 14px;
            border-radius: 10px;
            text-align: center;
            font-weight: 500;
            display: none;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .status.loading {
            background-color: rgba(59, 130, 246, 0.12);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
            display: block;
        }

        .status.success {
            background-color: rgba(16, 185, 129, 0.12);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
            display: block;
        }

        .status.error {
            background-color: rgba(239, 68, 68, 0.12);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.3);
            display: block;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 0.9rem;
            color: var(--text-secondary);
            font-weight: 300;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>HTML-to-PPTX Slide Engine</h1>
            <p>Input custom HTML layouts designed in 1280x720 coordinates to convert to perfect PowerPoint presentations</p>
        </header>

        <div class="card">
            <form id="convertForm">
                <div class="form-group">
                    <label for="htmlCode">HTML String Input</label>
                    <textarea id="htmlCode" name="htmlCode" placeholder="<!-- Paste your presentation slide markup here -->
<div style='width: 1280px; height: 720px; background-color: #0b0f19; font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white;'>
  <h1 style='font-size: 60px; color: #3b82f6; margin-bottom: 24px;'>Slide Title</h1>
  <p style='font-size: 24px; color: #9ca3af;'>Slide content layout parsed by Node.js engine.</p>
</div>"></textarea>
                </div>
                <button type="submit" id="submitBtn">
                    <span>Convert to PPTX</span>
                </button>
            </form>
            <div id="statusBox" class="status"></div>
        </div>

        <div class="footer">
            HTML-to-PPTX Engine • Built with Puppeteer and PptxGenJS
        </div>
    </div>

    <script type="module">
        import { extractSlideData } from '/engine/extractor.js';

        const form = document.getElementById('convertForm');
        const submitBtn = document.getElementById('submitBtn');
        const statusBox = document.getElementById('statusBox');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const html = document.getElementById('htmlCode').value.trim();
            if (!html) {
                showStatus('Please enter your HTML code first.', 'error');
                return;
            }

            showStatus('Parsing and extracting DOM elements in the browser...', 'loading');
            submitBtn.disabled = true;

            try {
                // Render the HTML string in a temporary off-screen container to run the DOM style extractor
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'fixed';
                tempContainer.style.top = '-9999px';
                tempContainer.style.left = '-9999px';
                tempContainer.style.width = '1280px';
                tempContainer.style.height = '720px';
                tempContainer.style.visibility = 'hidden';
                document.body.appendChild(tempContainer);
                tempContainer.innerHTML = html;

                // Brief timeout to ensure DOM nodes are parsed
                await new Promise(resolve => setTimeout(resolve, 300));

                const slideEls = tempContainer.querySelectorAll('.slide');
                const slides = [];

                if (slideEls.length > 0) {
                    for (let idx = 0; idx < slideEls.length; idx++) {
                        const slideData = await extractSlideData(slideEls[idx], idx);
                        slides.push(slideData);
                    }
                } else {
                    const slideData = await extractSlideData(tempContainer, 0);
                    slides.push(slideData);
                }

                // Clean up the temporary container
                document.body.removeChild(tempContainer);

                showStatus('DOM elements extracted! Sending JSON to backend for compilation...', 'loading');

                const response = await fetch('/api/convert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slides })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Conversion process failed');
                }

                showStatus('Conversion successful! Downloading output.pptx...', 'success');
                
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'output.pptx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                showStatus('Error: ' + err.message, 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });

        function showStatus(message, type) {
            statusBox.textContent = message;
            statusBox.className = 'status ' + type;
        }
    </script>
</body>
</html>
  `);
});

// API Endpoint to process and convert layout
app.post('/api/convert', async (req, res) => {
    const { slides } = req.body;
    console.log(slides);
    
    if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'Missing or invalid slides array' });
    }

    const tempFile = path.join(__dirname, `temp_${Date.now()}.pptx`);

    try {
        console.log('[Server] Incoming conversion request, starting conversion...');
        const result = await convertHtmlToPptx({
            slides,
            outputPath: tempFile
        });
        res.json({ success: true })
    } catch (err) {
        console.error('[Server] Conversion error:', err);
        res.status(500).json({ error: err.message || 'Error occurred during layout conversion' });
    } 
});

app.listen(PORT, () => {
    console.log(`[Server] Web App running at http://localhost:${PORT}`);
});
