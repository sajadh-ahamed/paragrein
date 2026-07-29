package com.paragrein.logistics.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PdfGenerationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PdfGenerationService.class);

    // Generates a complete PDF report with a header, title, filters, table, and
    // footer.
    public byte[] generateReportPdf(String reportTitle, Map<String, String> filters, String[] headers,
            List<String[]> data) {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Draw Header
                drawHeader(document, contentStream);

                // Draw Report Title and Filters
                float yPosition = 700;
                yPosition = drawReportTitle(contentStream, reportTitle, yPosition);
                yPosition = drawFilters(contentStream, filters, yPosition);

                // Draw Table
                drawTable(contentStream, headers, data, yPosition);

                // Draw Footer
                drawFooter(contentStream);
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            LOGGER.error("Error generating PDF report", e);
            // In a real app, you might throw a custom exception here
            return new byte[0];
        }
    }

    private void drawHeader(PDDocument document, PDPageContentStream contentStream) throws IOException {
        // Load logo from classpath resources
        try (InputStream logoStream = getClass().getResourceAsStream("/static/images/logo.png")) {
            if (logoStream != null) {
                PDImageXObject logo = PDImageXObject.createFromByteArray(document, logoStream.readAllBytes(), "logo");
                contentStream.drawImage(logo, 50, 750, 50, 50);
            }
        }

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
        contentStream.newLineAtOffset(110, 770);
        contentStream.showText("Paragrein Logistics");
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
        contentStream.newLineAtOffset(110, 755);
        contentStream.showText("Move Smart. Move Paragrein.");
        contentStream.endText();
    }

    private float drawReportTitle(PDPageContentStream contentStream, String title, float y) throws IOException {
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
        contentStream.newLineAtOffset(50, y);
        contentStream.showText(title);
        contentStream.endText();
        return y - 25;
    }

    private float drawFilters(PDPageContentStream contentStream, Map<String, String> filters, float y)
            throws IOException {
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 9);
        for (Map.Entry<String, String> entry : filters.entrySet()) {
            contentStream.beginText();
            contentStream.newLineAtOffset(50, y);
            contentStream.showText(entry.getKey() + ": " + entry.getValue());
            contentStream.endText();
            y -= 15;
        }
        return y - 10; // Extra space after filters
    }

    private void drawTable(PDPageContentStream contentStream, String[] headers, List<String[]> data, float yStart)
            throws IOException {
        final int rows = data.size();
        final int cols = headers.length;
        final float rowHeight = 20f;
        final float tableWidth = 500f;
        final float colWidth = tableWidth / cols;
        final float margin = 50;

        // Draw header
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 8);
        float nextX = margin;
        for (String header : headers) {
            contentStream.beginText();
            contentStream.newLineAtOffset(nextX + 5, yStart - 15);
            contentStream.showText(header);
            contentStream.endText();
            nextX += colWidth;
        }

        // Draw rows
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 8);
        float nextY = yStart;
        for (String[] rowData : data) {
            nextY -= rowHeight;
            nextX = margin;
            for (String cellData : rowData) {
                contentStream.beginText();
                contentStream.newLineAtOffset(nextX + 5, nextY);
                // Simple truncation for long text
                String text = cellData != null ? cellData : "";
                if (text.length() > 25) {
                    text = text.substring(0, 22) + "...";
                }
                contentStream.showText(text);
                contentStream.endText();
                nextX += colWidth;
            }
        }
    }

    private void drawFooter(PDPageContentStream contentStream) throws IOException {
        String date = "Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 8);
        contentStream.newLineAtOffset(50, 50);
        contentStream.showText(date);
        contentStream.endText();

        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 8);
        contentStream.newLineAtOffset(500, 50);
        contentStream.showText("Page 1"); // Simple page number for now
        contentStream.endText();
    }
}