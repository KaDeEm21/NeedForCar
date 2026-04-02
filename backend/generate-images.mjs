import { imagePresets } from './image-presets.mjs';

const apiBase = process.env.IMAGE_GENERATOR_API_BASE ?? 'http://localhost:3001';

async function main() {
  for (const item of imagePresets) {
    const response = await fetch(`${apiBase}/api/images/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${item.filename}: ${result.message || 'Image generation failed.'}`);
    }

    console.log(`${item.filename} -> ${result.relativePath}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
