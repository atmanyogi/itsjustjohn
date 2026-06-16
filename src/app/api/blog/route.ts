import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as cheerio from 'cheerio';
import fs from 'fs';

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

async function loadPosts(): Promise<Post[]> {
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

  return posts.filter(Boolean) as Post[];
}

export async function GET() {
  const posts = await loadPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }
    const posts = await loadPosts();
    const post = posts.find((p) => p.slug === slug) || null;
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}
