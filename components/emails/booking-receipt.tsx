import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingReceiptProps {
  customerName: string;
  bookingType: string;
  dateRange: string;
  totalPrice: string;
  bookingId: string;
}

export const BookingReceipt = ({
  customerName,
  bookingType,
  dateRange,
  totalPrice,
  bookingId,
}: BookingReceiptProps) => (
  <Html>
    <Head />
    <Preview>Your Valhalla Voyage is Confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Valhalla Voyage</Heading>
        <Text style={heroText}>Booking Confirmed</Text>

        <Section style={detailsBox}>
          <Text style={paragraph}>Hi {customerName},</Text>
          <Text style={paragraph}>
            We are honored to welcome you aboard. Your reservation has been secured.
            Please retain this email as your boarding pass.
          </Text>
          
          <Hr style={hr} />

          <div style={statRow}>
            <Text style={statLabel}>Confirmation Ref</Text>
            <Text style={statValue}>#{bookingId.slice(0, 8).toUpperCase()}</Text>
          </div>
          
          <div style={statRow}>
            <Text style={statLabel}>Experience</Text>
            <Text style={statValue}>{bookingType.toUpperCase()}</Text>
          </div>

          <div style={statRow}>
            <Text style={statLabel}>Dates</Text>
            <Text style={statValue}>{dateRange}</Text>
          </div>

          <div style={statRow}>
            <Text style={statLabel}>Total Paid</Text>
            <Text style={statValue}>{totalPrice}</Text>
          </div>

          <Hr style={hr} />

          <Text style={paragraph}>
            <strong>📍 Location:</strong><br />
            Aker Brygge Marina<br />
            <Link href="https://goo.gl/maps/YOUR_MAP_LINK" style={link}>View on Google Maps</Link>
          </Text>

          <Text style={paragraph}>
            <strong>📞 Your Captain:</strong><br />
            Fred Olav Bore<br />
            +47 975 36 122
          </Text>
        </Section>

        <Text style={footer}>
          © 2026 Valhalla Voyage. Silent Luxury.
        </Text>
      </Container>
    </Body>
  </Html>
);

// CSS Styles (Inline for Email Compatibility)
const main = {
  backgroundColor: '#0f172a', // Slate-950
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
  fontFamily: 'Times New Roman, serif',
};

const heroText = {
  color: '#fbbf24', // Amber-400
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const detailsBox = {
  backgroundColor: '#1e293b', // Slate-800
  borderRadius: '12px',
  padding: '32px',
  border: '1px solid #334155',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#e2e8f0',
};

const statRow = {
  marginBottom: '16px',
};

const statLabel = {
  fontSize: '12px',
  color: '#94a3b8',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0',
};

const statValue = {
  fontSize: '18px',
  color: '#ffffff',
  fontWeight: 'bold',
  margin: '4px 0 0 0',
};

const hr = {
  borderColor: '#334155',
  margin: '24px 0',
};

const link = {
  color: '#38bdf8',
  textDecoration: 'underline',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '40px',
};

export default BookingReceipt;