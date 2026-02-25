package com.paragrein.Paragrein_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

@Service
public class EmailDomainValidationService {

    @Value("${app.auth.strict-email-domain-validation:false}")
    private boolean strictEmailDomainValidation;

    public boolean hasDeliverableDomain(String email) {
        if (!strictEmailDomainValidation) {
            return true;
        }

        String domain = extractDomain(email);
        if (!StringUtils.hasText(domain)) {
            return false;
        }

        Hashtable<String, String> environment = new Hashtable<>();
        environment.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");

        try {
            DirContext context = new InitialDirContext(environment);
            Attributes mxAttributes = context.getAttributes(domain, new String[]{"MX"});
            Attribute mxRecords = mxAttributes.get("MX");
            if (mxRecords != null && hasAtLeastOneValue(mxRecords)) {
                return true;
            }

            Attributes aAttributes = context.getAttributes(domain, new String[]{"A"});
            Attribute aRecords = aAttributes.get("A");
            return aRecords != null && hasAtLeastOneValue(aRecords);
        } catch (Exception ignored) {
            return false;
        }
    }

    private boolean hasAtLeastOneValue(Attribute attribute) throws Exception {
        NamingEnumeration<?> values = attribute.getAll();
        return values.hasMore();
    }

    private String extractDomain(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }

        String normalizedEmail = email.trim();
        int atIndex = normalizedEmail.lastIndexOf('@');
        if (atIndex <= 0 || atIndex == normalizedEmail.length() - 1) {
            return null;
        }
        return normalizedEmail.substring(atIndex + 1).toLowerCase();
    }
}
