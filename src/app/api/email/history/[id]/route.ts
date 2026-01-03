import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import EmailHistory, { IEmailHistory } from '@/models/EmailHistory';
import mongoose from 'mongoose';

// Interface for MongoDB document with _id
interface EmailHistoryDoc extends IEmailHistory {
  _id: mongoose.Types.ObjectId;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from request
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const id = params.id;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid email ID format' }, { status: 400 });
    }

    // Get email by ID
    const email = await EmailHistory.findById(id).lean();

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Cast to the proper type
    const typedEmail = email as unknown as EmailHistoryDoc;

    // Check if the user owns this email
    if (typedEmail.userId.toString() !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Format email for response
    const formattedEmail = {
      id: typedEmail._id.toString(),
      subject: typedEmail.subject,
      recipients: typedEmail.recipients,
      recipient: typedEmail.recipients[0], // For backwards compatibility
      templateId: typedEmail.templateId,
      sentDate: typedEmail.sentAt.toISOString(),
      status: typedEmail.status,
      errorMessage: typedEmail.errorMessage,
      content: typedEmail.content
    };

    return NextResponse.json({ email: formattedEmail });
  } catch (error: any) {
    console.error('Error fetching email details:', error);
    return NextResponse.json(
      { error: `Failed to fetch email details: ${error.message}` },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 