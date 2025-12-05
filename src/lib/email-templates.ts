import mongoose from 'mongoose';
import EmailTemplate from '@/models/EmailTemplate';

// Direct image URL for email clients
const logoUrl = "https://i.imgur.com/P8J3e6Y.png";

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  html: string;
  variables: string[];
  defaultValues?: Record<string, string>;
  predefined?: boolean;
  isPublic?: boolean;
  isOwner?: boolean;
  userId?: string;
  createdAt?: string;
  _id?: string;
  content?: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Send a welcome email to new users',
    subject: 'Welcome to PaletteMail, {{name}}!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Welcome to PaletteMail, {{name}}!</h1>
          <p style="margin-bottom: 15px;">Thank you for signing up! We're excited to have you on board.</p>
          <p style="margin-bottom: 15px;">Your account has been successfully created with the email: <strong>{{email}}</strong></p>
          <p style="margin-bottom: 15px;">If you have any questions or need assistance, feel free to reply to this email. Our support team is always here to help.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{loginLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
          </div>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>This email was sent by {{senderName}} via PaletteMail</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['name', 'email', 'loginLink', 'senderName', 'baseUrl'],
    predefined: true,
  },
  {
    id: 'monthly-newsletter',
    name: 'Monthly Newsletter',
    description: 'Send a monthly newsletter with updates and news',
    subject: '{{month}} Newsletter - Latest Updates From Our Team',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">{{month}} Newsletter</h1>
          <p style="margin-bottom: 15px;">Hello {{name}},</p>
          <p style="margin-bottom: 15px;">Here are the latest updates from our team:</p>
          
          <div style="margin: 25px 0;">
            {{#each newsItems}}
            <div style="margin-bottom: 20px; border-left: 3px solid #4F46E5; padding-left: 15px;">
              <h3 style="margin-bottom: 10px; color: #4F46E5;">{{this.title}}</h3>
              <p>{{this.content}}</p>
            </div>
            {{/each}}
          </div>
          
          <p style="margin-top: 15px;">Thank you for being a valued member of our community!</p>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>You received this email because you're subscribed to our newsletter.</p>
          <p>To unsubscribe, <a href="{{unsubscribeLink}}" style="color: #4F46E5;">click here</a>.</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['month', 'name', 'newsItems', 'unsubscribeLink', 'baseUrl'],
    predefined: true,
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Send a password reset link to users',
    subject: 'Reset Your Password - PaletteMail',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="margin-bottom: 15px;">Hello {{name}},</p>
          <p style="margin-bottom: 15px;">We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p style="margin-bottom: 15px;">To reset your password, please click the link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
          </div>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>This email was sent by {{senderName}} via PaletteMail</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['name', 'resetLink', 'senderName', 'baseUrl'],
  },
  {
    id: 'interview-invitation',
    name: 'Interview Invitation',
    description: 'Send an interview invitation to candidates',
    subject: 'Interview Invitation - {{position}} Position',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Interview Invitation</h1>
          <p style="margin-bottom: 15px;">Hello {{name}},</p>
          <p style="margin-bottom: 15px;">We're excited to invite you for an interview at {{company}}.</p>
          <p style="margin-bottom: 15px;">The interview is scheduled for {{interviewDate}} at {{interviewTime}}.</p>
          <p style="margin-bottom: 15px;">Please find the meeting details below:</p>
          <p><strong>Meeting ID:</strong> {{meetingID}}</p>
          <p><strong>Meeting Link:</strong> {{meetingLink}}</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{acceptLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accept Invitation</a>
            <a href="{{declineLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-left: 10px;">Decline Invitation</a>
          </div>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>This email was sent by {{senderName}} via PaletteMail</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['name', 'company', 'interviewDate', 'interviewTime', 'meetingID', 'meetingLink', 'acceptLink', 'declineLink', 'senderName', 'baseUrl'],
  },
  {
    id: 'general-notification',
    name: 'General Notification',
    description: 'Send a general notification to users',
    subject: '{{subject}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Important Notification</h1>
          <p style="margin-bottom: 15px;">Hello {{name}},</p>
          <p style="margin-bottom: 15px;">We're excited to announce that we've made some exciting changes to our service. Here's what's new:</p>
          <p>{{description}}</p>
          <p>We're confident that these changes will make your experience even better.</p>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{learnMoreLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Learn More</a>
          </div>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>This email was sent by {{senderName}} via PaletteMail</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['name', 'title', 'description', 'learnMoreLink', 'senderName', 'baseUrl'],
  },
  {
    id: 'security-alert',
    name: 'Security Alert',
    description: 'Send a security alert notification to users',
    subject: 'Security Alert - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="PaletteMail Logo" style="height: 60px; width: auto;" />
        </div>
        <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #4F46E5; font-size: 24px; margin-bottom: 20px;">Security Alert</h1>
          <p style="margin-bottom: 15px;">Hello {{name}},</p>
          <p style="margin-bottom: 15px;">We've detected unusual activity on your account. We're taking steps to protect your data.</p>
          <p style="margin-bottom: 15px;">If this was not you, please reset your password immediately.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetLink}}" style="background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
          </div>
        </div>
        <div style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
          <p>This email was sent by {{senderName}} via PaletteMail</p>
          <p>&copy; 2023 PaletteMail. All rights reserved.</p>
        </div>
      </div>
    `,
    variables: ['name', 'title', 'resetLink', 'senderName', 'baseUrl'],
  },
];

export default emailTemplates;

/**
 * Get all available predefined email templates
 */
export function getTemplates(): EmailTemplate[] {
  return emailTemplates;
}

/**
 * Get a predefined email template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

/**
 * Get a template from database by ID
 */
export async function getTemplateFromDb(id: string): Promise<any> {
  try {
    const template = await EmailTemplate.findById(id);
    return template;
  } catch (error) {
    console.error('Error fetching template from database:', error);
    return null;
  }
}

/**
 * Compile an email template with variables
 */
export function compileTemplate(templateHtml: string, variables: Record<string, string>): string {
  let compiledHtml = templateHtml;
  
  // Replace all variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    compiledHtml = compiledHtml.replace(regex, value || '');
  });
  
  return compiledHtml;
}

/**
 * Get template by ID with support for database templates
 */
export async function getTemplateByIdWithDb(id: string): Promise<EmailTemplate | null> {
  // First check predefined templates
  const predefinedTemplate = getTemplateById(id);
  if (predefinedTemplate) {
    return predefinedTemplate;
  }
  
  // Then check database
  try {
    const dbTemplate = await getTemplateFromDb(id);
    if (dbTemplate) {
      return {
        id: dbTemplate._id.toString(),
        name: dbTemplate.name,
        description: dbTemplate.description,
        subject: dbTemplate.subject,
        html: dbTemplate.html,
        variables: dbTemplate.variables,
        defaultValues: dbTemplate.defaultValues || {}
      };
    }
  } catch (error) {
    console.error('Error getting template with DB:', error);
  }
  
  return null;
}