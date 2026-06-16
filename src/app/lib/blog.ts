import path from 'path';
import * as cheerio from 'cheerio';

export interface Post {
  slug: string;
  title: string;
  date: string;
  teaser: string;
  htmlContent?: string;
  metaDescription?: string;
  ogImage?: string;
  tldr?: string[];
  faqs?: { q: string; a: string }[];
}

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getPosts(): Promise<Post[]> {
  // Since fs/promises is not available in Next.js app directory, use dynamic import of 'fs' in server context
  const fs = await import('fs');

  let fileNames: string[] = [];
  try {
    fileNames = await fs.promises.readdir(postsDirectory);
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }

  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.html'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.html$/, '');
        const filePath = path.join(postsDirectory, fileName);
        let fileContent = '';
        try {
          fileContent = await fs.promises.readFile(filePath, 'utf-8');
        } catch (error) {
          console.error(`Error reading post file ${filePath}:`, error);
          return null;
        }

        if (!fileContent) return null;

        const $ = cheerio.load(fileContent);
        const title = $('h1').first().text() || $('title').first().text() || slug;
        const teaser = $('p').first().text() || '';
        const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : '';
        const metaDescription = $('meta[name="description"]').attr('content') || teaser;
        let ogImage = '';
        $('img').each((i: number, el: cheerio.Element) => {
          const src = $(el).attr('src');
          if (src && (src.startsWith('/') || src.startsWith('http'))) {
            ogImage = src;
            return false;
          }
        });
        if (ogImage && ogImage.startsWith('/')) {
          ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${ogImage}`;
        }

        // Extract TL;DR bullets if present in a <ul class="tldr">
        const tldr: string[] = [];
        $('ul.tldr li').each((i: number, el: cheerio.Element) => {
          tldr.push($(el).text());
        });

        // Extract FAQs if present in a <div class="faq"> with Q/A pairs
        const faqs: { q: string; a: string }[] = [];
        $('div.faq > div.question').each((i: number, el: cheerio.Element) => {
          const q = $(el).find('h3').text();
          const a = $(el).find('p').text();
          if (q && a) {
            faqs.push({ q, a });
          }
        });

        return {
          slug,
          title,
          date,
          teaser,
          htmlContent: fileContent,
          metaDescription,
          ogImage,
          tldr,
          faqs,
        };
      })
  );

  return posts.filter(Boolean) as Post[]; // Type assertion to filter nulls
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fs = await import('fs');
  const filePath = path.join(postsDirectory, `${slug}.html`);
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const $ = cheerio.load(fileContent);
    const title = $('h1').first().text() || $('title').first().text() || slug;
    const teaser = $('p').first().text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || teaser;
    let ogImage = '';
    $('img').each((i: number, el: cheerio.Element) => {
      const src = $(el).attr('src');
      if (src && (src.startsWith('/') || src.startsWith('http'))) {
        ogImage = src;
        return false;
      }
    });
    if (ogImage && ogImage.startsWith('/')) {
      ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${ogImage}`;
    }

    // Extract TL;DR bullets if present in a <ul class="tldr">
    const tldr: string[] = [];
    $('ul.tldr li').each((i: number, el: cheerio.Element) => {
      tldr.push($(el).text());
    });

    // Extract FAQs if present in a <div class="faq"> with Q/A pairs
    const faqs: { q: string; a: string }[] = [];
    $('div.faq > div.question').each((i: number, el: cheerio.Element) => {
      const q = $(el).find('h3').text();
      const a = $(el).find('p').text();
      if (q && a) {
        faqs.push({ q, a });
      }
    });

    // Extract date from filename
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : '';

    return {
      slug,
      title,
      date,
      teaser,
      htmlContent: fileContent,
      metaDescription,
      ogImage,
      tldr,
      faqs,
    };
  } catch (error) {
    console.error(`Error reading post file ${filePath}:`, error);
    return null;
  }
}
