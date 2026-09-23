import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import path from "path";
import type { Cv } from "../types";

Font.registerHyphenationCallback((word) => [word]);

// The site's typeface, so the PDF and tany4.com read as the same thing
const fonts = path.join(process.cwd(), "src/cv/pdf/fonts");
Font.register({
  family: "Be Vietnam Pro",
  fonts: [
    { src: path.join(fonts, "BeVietnamPro-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fonts, "BeVietnamPro-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(fonts, "BeVietnamPro-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
  ],
});

// Mirrors the light theme in styles/_theme.scss. The sidebar is a wash rather than a
// solid block: the same colours as the site, but a page that prints without flooding it.
const colour = {
  accent: "#4a3ba8",
  accentWash: "#f5f3ff",
  ink: "#2f2a45",
  text: "#4f4a66",
  soft: "#857f9e",
  line: "#ded8f2",
  surface: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Be Vietnam Pro",
    fontSize: 10,
    lineHeight: 1.35,
    color: colour.text,
    backgroundColor: "#ffffff",
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },

  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 210,
    backgroundColor: colour.accentWash,
    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    color: colour.ink,
  },

  main: {
    marginLeft: 210,
    paddingTop: 8,
    paddingRight: 32,
    paddingBottom: 24,
    paddingLeft: 26,
  },

  pageHeader: {
    height: 20,
    marginLeft: 210,
  },

  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 30,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
    lineHeight: 1.02,
    color: colour.accent,
  },

  titleRow: {
    marginTop: 10,
    fontSize: 13,
    color: colour.text,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
  },

  contactRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    color: colour.soft,
    fontSize: 9,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  contactIcon: {
    width: 10,
    height: 10,
  },

  contactLink: {
    color: colour.soft,
    textDecoration: "none",
  },

  headerDivider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colour.line,
    borderBottomStyle: "solid",
  },

  sectionHeading: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 9,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: colour.accent,
  },

  sectionDivider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colour.line,
    borderBottomStyle: "solid",
  },

  sidebarSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colour.line,
    borderTopStyle: "solid",
  },

  sidebarSectionFirst: {
    marginTop: 0,
    paddingTop: 0,
    borderTopWidth: 0,
    borderTopStyle: "solid",
  },

  sidebarHeading: {
    marginBottom: 8,
    fontSize: 9,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  sidebarHeadingSecondary: {
    marginBottom: 6,
    fontSize: 8,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colour.soft,
  },

  sidebarParagraph: {
    marginBottom: 8,
    fontSize: 9.5,
    lineHeight: 1.4,
  },

  sidebarParagraphSecondary: {
    marginBottom: 6,
    fontSize: 8.5,
    lineHeight: 1.4,
    color: colour.text,
  },

  sidebarList: {
    marginTop: 4,
    paddingLeft: 0,
  },

  sidebarListItem: {
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  sidebarBulletItem: {
    flexDirection: "row",
    marginBottom: 6,
  },

  sidebarBullet: {
    width: 12,
    fontSize: 8.5,
    color: colour.soft,
  },

  sidebarBulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  sidebarLink: {
    color: colour.accent,
    textDecoration: "none",
  },

  // The sidebar's content ends on page one; page two fills the empty column with
  // education and languages, which are short and read fine in a narrow measure
  sidebarPageTwo: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 210,
    paddingTop: 24,
    paddingRight: 16,
    paddingLeft: 16,
    color: colour.ink,
  },

  sidebarEduRow: {
    marginBottom: 10,
  },

  sidebarEduDate: {
    fontSize: 8.5,
    color: colour.soft,
    marginBottom: 1,
  },

  sidebarEduSchool: {
    fontSize: 9.5,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
  },

  sidebarEduDegree: {
    fontSize: 9,
    color: colour.text,
    lineHeight: 1.4,
  },

  sidebarLanguageRow: {
    marginBottom: 6,
  },

  sidebarLanguageName: {
    fontSize: 9.5,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
  },

  sidebarLanguageLevel: {
    fontSize: 9,
    color: colour.soft,
  },

  role: {
    marginBottom: 12,
  },

  roleMeta: {
    flexDirection: "column",
  },

  dates: {
    color: colour.soft,
    fontSize: 10,
    marginBottom: 2,
  },

  roleTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  roleTitle: {
    fontSize: 10,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
  },

  company: {
    fontSize: 10,
    color: colour.text,
  },

  roleSummary: {
    margin: "4px 0",
    color: colour.text,
    fontFamily: "Be Vietnam Pro", fontStyle: "italic",
    fontSize: 9,
    lineHeight: 1.5,
  },

  

  sidebarLinkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  bullets: {
    marginTop: 4,
    marginBottom: 4,
  },

  bulletItem: {
    marginBottom: 5,
    fontSize: 9,
    lineHeight: 1.5,
    paddingLeft: 8,
  },

  eduRow: {
    marginBottom: 12,
  },

  eduMeta: {
    flexDirection: "column",
  },

  eduDate: {
    color: colour.soft,
    fontSize: 10,
    marginBottom: 2,
  },

  eduTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  eduSchool: {
    fontSize: 10,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
  },

  eduDegree: {
    fontSize: 10,
    color: colour.text,
    marginLeft: 6,
  },

  languagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  languageItem: {
    flex: 1,
  },

  languageName: {
    fontSize: 9,
    color: colour.text,
  },

  languageLevel: {
    fontSize: 9,
    color: colour.soft,
  },

  languageCode: {
    fontSize: 9,
    fontFamily: "Be Vietnam Pro", fontWeight: 600,
    color: colour.soft,
  },

  languageBarWrap: {
    marginTop: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: colour.line,
    overflow: "hidden",
  },

  languageBarFill: {
    height: 4,
    backgroundColor: colour.accent,
  },

  strengthsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },

  strengthItem: {
    fontSize: 9,
    color: colour.text,
  },

  strengthBullet: {
    fontSize: 9,
    color: colour.accent,
    marginRight: 4,
  },
});

function MailIcon({ color = colour.soft }: { color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" style={styles.contactIcon}>
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PinIcon({ color = colour.soft }: { color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" style={styles.contactIcon}>
      <Path
        d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11zm0-8.8a2.2 2.2 0 110-4.4 2.2 2.2 0 010 4.4z"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PortfolioIcon({ color = colour.soft }: { color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" style={styles.contactIcon}>
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 22V12h6v10"
        stroke={color}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SidebarSection({
  section,
  isFirst,
}: {
  section: Cv["sidebar"][number];
  isFirst?: boolean;
}) {
  const isSecondary = section.title === "Hobbies and interests" || section.title === "Certifications";
  return (
    <View
      style={isFirst ? styles.sidebarSectionFirst : styles.sidebarSection}
      wrap={false}
    >
      <Text style={isSecondary ? styles.sidebarHeadingSecondary : styles.sidebarHeading}>{section.title}</Text>

      {section.paragraphs?.map((p) => (
        <>
        <Text key={p} style={isSecondary ? styles.sidebarParagraphSecondary : styles.sidebarParagraph}>
          {p}
        </Text></>
      ))}

      
      {section.bullets && (
        <View style={styles.sidebarList}>
          {section.bullets.map((b) => (
            <View key={b} style={styles.sidebarBulletItem}>
              <Text style={styles.sidebarBullet}>•</Text>
              <Text style={styles.sidebarBulletText}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ExperienceRole({ role }: { role: Cv["experience"][number] }) {
  const [firstBullet, ...otherBullets] = role.bullets;
  const bullet = (b: string) => (
    <Text key={b} style={styles.bulletItem}>
      {`• ${b}`}
    </Text>
  );

  return (
    <View style={styles.role}>
      {/* Keep the title with its summary and first bullet, so a role never starts at the foot of a page */}
      <View wrap={false}>
        <View style={styles.roleMeta}>
          <Text style={styles.dates}>{`${role.start} - ${role.end}`}</Text>
          <View style={styles.roleTitleRow}>
            <Text style={styles.roleTitle}>{role.title} </Text>
            <Text style={styles.company}>{'  - '}{role.company}</Text>
          </View>
        </View>

        {role.summary ? <Text style={styles.roleSummary}>{role.summary}</Text> : null}

        {firstBullet ? <View style={[styles.bullets, { marginBottom: 0 }]}>{bullet(firstBullet)}</View> : null}
      </View>

      {otherBullets.length > 0 ? <View style={[styles.bullets, { marginTop: 0 }]}>{otherBullets.map(bullet)}</View> : null}
    </View>
  );
}

export default function CvPdfDocument({ cv }: { cv: Cv }) {
  const [firstName = "", ...rest] = cv.header.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <Document title={`${cv.header.name} - CV`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>

          <SidebarSection
            key="personal-summary"
            section={{ title: "Summary", paragraphs: [cv.personalStatement, cv.summary] }}
            isFirst={true}
          />
          
          {cv.sidebar.map((section, index) => (
            <SidebarSection
              key={`${section.title}-${index}`}
              section={section}
            />
          ))}
        </View>

        <View style={styles.pageHeader} fixed render={({ pageNumber }) => (pageNumber > 1 ? <View /> : null)} />

        <View
          fixed
          render={({ pageNumber }) =>
            pageNumber === 2 ? (
              <View style={styles.sidebarPageTwo}>
                <Text style={styles.sidebarHeading}>Education</Text>
                {cv.education.map((edu) => (
                  <View key={`${edu.institution}-${edu.date}`} style={styles.sidebarEduRow} wrap={false}>
                    <Text style={styles.sidebarEduDate}>{edu.date}</Text>
                    <Text style={styles.sidebarEduSchool}>{edu.institution}</Text>
                    <Text style={styles.sidebarEduDegree}>{edu.degree}</Text>
                  </View>
                ))}

                <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarHeading}>Languages</Text>
                  {cv.languages.map((l) => (
                    <View key={l.name} style={styles.sidebarLanguageRow} wrap={false}>
                      <Text style={styles.sidebarLanguageName}>{l.name}</Text>
                      <Text style={styles.sidebarLanguageLevel}>
                        {l.levelLabel}{l.levelCode ? ` (${l.levelCode})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null
          }
        />

        <View style={styles.main}>
          <Text style={styles.nameRow}>
            <Text>{firstName}</Text>
            {lastName ? <Text>{` ${lastName}`}</Text> : null}
          </Text>
          <Text style={styles.titleRow}>{cv.header.title}</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <MailIcon />
              <Text>{cv.header.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <PinIcon />
              <Text>{cv.header.location}</Text>
            </View>
            {cv.header.website && (
              <View style={styles.contactItem}>
                <PortfolioIcon />
                <Link src={`https://${cv.header.website}`} style={styles.contactLink} >
                  <Text>{cv.header.website}</Text>
                </Link>
              </View>
            )}
          </View>
          <View style={styles.headerDivider} />

          <Text style={styles.sectionHeading}>Key Strengths</Text>
          <View style={styles.strengthsRow}>
            {cv.strengths.map((strength, index) => (
              <Text key={strength.title} style={styles.strengthItem}>
                <Text style={styles.strengthBullet}>•</Text>
                {strength.title}
                {index < cv.strengths.length - 1 ? "   " : ""}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionHeading}>Experience</Text>
          {cv.experience.map((role) => (
            <ExperienceRole
              key={`${role.company}-${role.title}-${role.start}`}
              role={role}
            />
          ))}

        </View>
      </Page>
    </Document>
  );
}
