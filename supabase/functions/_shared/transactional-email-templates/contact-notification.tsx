/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  company?: string
  message?: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, Helvetica, sans-serif',
}

const container = { margin: '0 auto', padding: '24px', maxWidth: '560px' }
const h1 = { color: '#0f1729', fontSize: '20px', margin: '0 0 16px' }
const label = { color: '#6b7280', fontSize: '12px', margin: '12px 0 2px', textTransform: 'uppercase' as const }
const value = { color: '#0f1729', fontSize: '15px', margin: '0' }
const msg = { color: '#0f1729', fontSize: '15px', lineHeight: '24px', whiteSpace: 'pre-line' as const }

function ContactNotification({ name, email, company, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`Neue Anfrage von ${name || 'Website-Besucher'}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Neue Kontaktanfrage über teamfokus.app</Heading>
          <Section>
            <Text style={label}>Name</Text>
            <Text style={value}>{name || '—'}</Text>
            <Text style={label}>E-Mail</Text>
            <Text style={value}>{email || '—'}</Text>
            <Text style={label}>Unternehmen</Text>
            <Text style={value}>{company || '—'}</Text>
          </Section>
          <Hr />
          <Text style={label}>Nachricht</Text>
          <Text style={msg}>{message || '—'}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactNotification,
  displayName: 'Kontaktanfrage (intern)',
  subject: (data: Record<string, any>) =>
    `Neue Anfrage: ${data?.name || 'Website-Besucher'}${data?.company ? ` (${data.company})` : ''}`,
  to: 'joel@teamfokus.app',
  previewData: {
    name: 'Anna Muster',
    email: 'anna@beispiel.de',
    company: 'Muster GmbH',
    message: 'Wir haben 120 Mitarbeitende und interessieren uns für TeamFokus.',
  },
} satisfies TemplateEntry
