package com.paragrein.Paragrein_backend.service.impl;

import com.paragrein.Paragrein_backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Override
    public void sendEmail(String to, String subject, String body) {
        if (!StringUtils.hasText(to)) {
            log.warn("Email skipped: recipient address is empty.");
            return;
        }
        if (!StringUtils.hasText(fromEmail)) {
            log.warn("Email skipped: MAIL_USERNAME is not configured (local mode).");
            return;
        }
        if (!StringUtils.hasText(mailPassword)) {
            log.warn("Email skipped: MAIL_APP_PASSWORD is not configured (local mode).");
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            
            // Convert plain text to HTML for better deliverability
            String htmlBody = convertToHtml(body);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
            log.info("Password reset email sent to {}", to);
        } catch (MessagingException e) {
            log.warn("Email send failed for {}. Continuing without blocking request. Reason: {}", to, e.getMessage());
        }
    }

    private String convertToHtml(String plainText) {
        return "<!DOCTYPE html>" +
               "<html><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; color: #333;'>" +
               "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
               "<img src='https://via.placeholder.com/150' alt='Paragrein Logo' style='display: block; margin-bottom: 20px;'><br>" +
               plainText.replace("\n", "<br>") +
               "<p style='margin-top: 30px; font-size: 12px; color: #999;'>This is an automated email. Please do not reply.</p>" +
               "</div></body></html>";
    }
}
