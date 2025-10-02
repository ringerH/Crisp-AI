import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const extractInfoFromText = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
   
    const nameRegex = /([A-Z][a-z]+)\s([A-Z][a-z]+)/;

    const email = text.match(emailRegex)?.[0] || null;
    const phone = text.match(phoneRegex)?.[0] || null;
    const name = text.match(nameRegex)?.[0] || null;

    return { name, email, phone };
};


export const parseResume = async (file) => {
    let rawText = '';
    
    if (file.type === 'application/pdf') {
        const fileReader = new FileReader();
        return new Promise((resolve, reject) => {
            fileReader.onload = async function() {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    rawText += textContent.items.map(item => item.str).join(' ');
                }
                resolve(extractInfoFromText(rawText));
            };
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(file);
        });
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        rawText = result.value;
        return extractInfoFromText(rawText);
    } else {
        throw new Error('Unsupported file type');
    }
};