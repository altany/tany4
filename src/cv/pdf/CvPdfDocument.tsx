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
import type { Cv } from "../types";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.35,
    color: "#111111",
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
    backgroundColor: "#2f6f7f",
    paddingTop: 24,
    paddingRight: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    color: "#ffffff",
  },

  main: {
    marginLeft: 210,
    paddingTop: 24,
    paddingRight: 26,
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
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.02,
    color: "#2f6f7f",
  },

  titleRow: {
    marginTop: 10,
    fontSize: 13,
    color: "#444444",
    fontFamily: "Helvetica-Bold",
  },

  contactRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    color: "#666666",
    fontSize: 10,
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
    color: "#666666",
    textDecoration: "none",
  },

  headerDivider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2f6f7f",
    borderBottomStyle: "solid",
  },

  sectionHeading: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#2f6f7f",
  },

  sectionDivider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2f6f7f",
    borderBottomStyle: "solid",
  },

  sidebarSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.22)",
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
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  sidebarParagraph: {
    marginBottom: 8,
    fontSize: 8.5,
    lineHeight: 1.4,
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
    color: "rgba(255, 255, 255, 0.7)",
  },

  sidebarBulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.5,
  },

  sidebarLink: {
    color: "#ffffff",
    textDecoration: "none",
  },

  role: {
    marginBottom: 12,
  },

  roleMeta: {
    flexDirection: "column",
  },

  dates: {
    color: "#888888",
    fontSize: 10,
    marginBottom: 2,
  },

  roleTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  roleTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  company: {
    fontSize: 10,
    color: "#444444",
  },

  roleSummary: {
    margin: "4px 0",
    color: "#555555",
    fontFamily: "Helvetica-Oblique",
    fontSize: 10,
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
  },

  eduRow: {
    marginBottom: 12,
  },

  eduMeta: {
    flexDirection: "column",
  },

  eduDate: {
    color: "#888888",
    fontSize: 10,
    marginBottom: 2,
  },

  eduTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  eduSchool: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  eduDegree: {
    fontSize: 10,
    color: "#444444",
    marginLeft: 6,
  },

  languageRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    borderTopStyle: "solid",
    paddingTop: 8,
    marginBottom: 6,
  },

  languageTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },

  languageName: {
    fontSize: 10,
  },

  languageCode: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#666666",
  },

  languageBarWrap: {
    marginTop: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d9d9d9",
    overflow: "hidden",
  },

  languageBarFill: {
    height: 4,
    backgroundColor: "#2f6f7f",
  },
});

function MailIcon({ color = "#666666" }: { color?: string }) {
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

function PinIcon({ color = "#666666" }: { color?: string }) {
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

function PortfolioIcon({ color = "#666666" }: { color?: string }) {
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



function languageLevelToPercent(levelLabel: string, levelCode?: string): number {
  const code = (levelCode || "").toUpperCase();
  if (levelLabel.toLowerCase().includes("first")) return 100;
  const map: Record<string, number> = {
    A1: 20,
    A2: 30,
    B1: 50,
    B2: 65,
    C1: 80,
    C2: 90,
  };
  if (code in map) return map[code];
  // fallback for labels like "Proficient" etc.
  if (levelLabel.toLowerCase().includes("proficient")) return 85;
  if (levelLabel.toLowerCase().includes("beginner")) return 25;
  return 60;
}

function SidebarSection({
  section,
  isFirst,
}: {
  section: Cv["sidebar"][number];
  isFirst?: boolean;
}) {
  return (
    <View
      style={isFirst ? styles.sidebarSectionFirst : styles.sidebarSection}
      wrap={false}
    >
      <Text style={styles.sidebarHeading}>{section.title}</Text>

      {section.paragraphs?.map((p) => (
        <Text key={p} style={styles.sidebarParagraph}>
          {p}
        </Text>
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
  return (
    <View style={styles.role} wrap={false}>
      <View style={styles.roleMeta}>
        <Text style={styles.dates}>{`${role.start} - ${role.end}`}</Text>
        <View style={styles.roleTitleRow}>
          <Text style={styles.roleTitle}>{role.title} </Text>
          <Text style={styles.company}>{'  - '}{role.company}</Text>
        </View>
      </View>

      {role.summary ? <Text style={styles.roleSummary}>{role.summary}</Text> : null}

      <View style={styles.bullets}>
        {role.bullets.map((b) => (
          <Text key={b} style={styles.bulletItem}>
            {`• ${b}`}
          </Text>
        ))}
      </View>
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
          {cv.sidebar.map((section, index) => (
            <SidebarSection
              key={section.title}
              section={section}
              isFirst={index === 0}
            />
          ))}
        </View>

        <View style={styles.pageHeader} fixed render={({ pageNumber }) => (pageNumber > 1 ? <View /> : null)} />

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

          <Text style={styles.sectionHeading}>Experience</Text>
          {cv.experience.map((role) => (
            <ExperienceRole
              key={`${role.company}-${role.title}-${role.start}`}
              role={role}
            />
          ))}

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionHeading}>Education</Text>
          <View wrap={false}>
            {cv.education.map((edu) => (
              <View key={`${edu.institution}-${edu.date}`} style={styles.eduRow} wrap={false}>
                <View style={styles.eduMeta}>
                  <Text style={styles.eduDate}>{edu.date}</Text>
                  <View style={styles.eduTitleRow}>
                    <Text style={styles.eduSchool}>{edu.institution}</Text>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionHeading}>Languages</Text>
          <View wrap={false}>
            {cv.languages.map((l) => (
              <View key={l.name} style={styles.languageRow} wrap={false}>
                <View style={styles.languageTop}>
                  <Text style={styles.languageName}>{`${l.name}: ${l.levelLabel}`}</Text>
                  <Text style={styles.languageCode}>{l.levelCode || ""}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
