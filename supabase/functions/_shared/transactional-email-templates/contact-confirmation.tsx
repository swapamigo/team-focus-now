/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  message?: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, Helvetica, sans-serif',
}
const container = { margin: '0 auto', padding: '24px', maxWidth: '560px' }
const h1 = { color: '#0f1729', fontSize: '22px', margin: '0 0 12px' }
const text = { color: '#55575d', fontSize: '15px', lineHeight: '24px' }
const quote = {
  color: '#0f1729',
  fontSize: '14px',
  lineHeight: '22px',
  whiteSpace: 'pre-line' as const,
  borderLeft: '3px solid #2f6bf0',
  paddingLeft: '12px',
  margin: '8px 0 16px',
}

function ContactConfirmation({ name, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Danke für deine Nachricht an TeamFokus</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Danke für deine Nachricht{name ? `, ${name}` : ''}!</Heading>
          <Text style={text}>
            Wir haben deine Anfrage erhalten und melden uns in der Regel innerhalb eines Werktags
            persönlich bei dir.
          </Text>
          {message ? <Text style={quote}>{message}</Text> : null}
          <Text style={text}>
            Du kannst uns jederzeit direkt schreiben:{' '}
            <Link href="mailto:joel@teamfokus.app">joel@teamfokus.app</Link>
          </Text>
          <Hr />
          <Text style={text}>Viele Grüße<br />Joel Schöppe · TeamFokus</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactConfirmation,
  displayName: 'Kontakt-Bestätigung (Besucher)',
  subject: 'Danke für deine Nachricht an TeamFokus',
  previewData: { name: 'Anna', message: 'Wir haben 120 Mitarbeitende.' },
} satisfies TemplateEntry
