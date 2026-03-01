'use client';

import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '7737493229';
    const message = encodeURIComponent('Hello! I am interested in your jewelry collection. Could you please help me?');

    return (
        <a
            href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsapp}
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={28} />
            <span className={styles.tooltip}>Chat with us</span>
        </a>
    );
}
