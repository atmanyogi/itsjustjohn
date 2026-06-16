import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/music-catalog - Returns the music catalog
export async function GET() {
  try {
    // Read the music catalog from the JSON file
    const catalogPath = path.join(process.cwd(), 'src/app/data/music_catalog.json');

    if (!fs.existsSync(catalogPath)) {
      return NextResponse.json(
        { error: 'Music catalog not found' },
        { status: 404 }
      );
    }

    const catalogData = fs.readFileSync(catalogPath, 'utf8');
    const catalog = JSON.parse(catalogData);

    return NextResponse.json(catalog);
  } catch (error) {
    console.error('Error loading music catalog:', error);
    return NextResponse.json(
      { error: 'Failed to load music catalog' },
      { status: 500 }
    );
  }
}

// POST /api/music-catalog - Update the music catalog (for admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.tracks && !body.albums) {
      return NextResponse.json(
        { error: 'Request must include tracks or albums' },
        { status: 400 }
      );
    }

    // Here you would add authentication/authorization checks
    // For now, just write directly to the file
    const catalogPath = path.join(process.cwd(), 'src/app/data/music_catalog.json');

    const currentData = fs.existsSync(catalogPath)
      ? JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
      : { tracks: [], albums: [] };

    const updatedData = {
      tracks: body.tracks || currentData.tracks,
      albums: body.albums || currentData.albums,
    };

    fs.writeFileSync(catalogPath, JSON.stringify(updatedData, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Music catalog updated successfully'
    });
  } catch (error) {
    console.error('Error updating music catalog:', error);
    return NextResponse.json(
      { error: 'Failed to update music catalog' },
      { status: 500 }
    );
  }
}
