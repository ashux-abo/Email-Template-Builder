import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import EmailHistory from '@/models/EmailHistory';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Get user from request
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get search params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // Build the query
    const query: any = { userId: user.id };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { recipients: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count for pagination
    const total = await EmailHistory.countDocuments(query);

    // Get emails with pagination
    const emails = await EmailHistory.find(query)
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format emails for response
    const formattedEmails = emails.map(email => ({
      id: String(email._id),
      subject: String(email.subject),
      recipients: Array.isArray(email.recipients) ? email.recipients : [],
      recipient: Array.isArray(email.recipients) && email.recipients.length > 0 ? email.recipients[0] : '',
      templateId: String(email.templateId),
      sentDate: email.sentAt ? new Date(email.sentAt).toISOString() : new Date().toISOString(),
      status: String(email.status),
      errorMessage: email.errorMessage ? String(email.errorMessage) : undefined,
    }));

    return NextResponse.json({
      emails: formattedEmails,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching email history:', error);
    return NextResponse.json(
      { error: `Failed to fetch email history: ${error.message}` },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 