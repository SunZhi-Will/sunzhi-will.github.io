'use client'

import { NewsletterPageShell, useNewsletterLang } from '@/components/blog/NewsletterPageShell';
import { NewsletterUnsubscribe } from '@/components/blog/NewsletterUnsubscribe';

export default function UnsubscribePage() {
    const lang = useNewsletterLang();

    return (
        <NewsletterPageShell lang={lang}>
            <NewsletterUnsubscribe lang={lang} />
        </NewsletterPageShell>
    );
}
