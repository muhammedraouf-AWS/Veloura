import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.ethereal.email'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USER', ''),
          pass: env('SMTP_PASS', ''),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@veloura.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'support@veloura.com'),
      },
    },
  },
  upload: {
    config: {
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: { folder: env('CLOUDINARY_FOLDER', 'veloura') },
        uploadStream: { folder: env('CLOUDINARY_FOLDER', 'veloura') },
        delete: {},
      },
    },
  },
});

export default config;
