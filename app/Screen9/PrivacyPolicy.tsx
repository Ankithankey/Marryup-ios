import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Terms of Service Section */}
        <Text style={styles.header}>MarryUp Terms of Service </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Effective Date:</Text> [05/03/2025]
        </Text>

        <Text style={styles.paragraph}>
          These Terms of Service govern your use of [MarryUp] (the "App"). By using the App, you agree to be bound by these terms.
        </Text>

        <Text style={styles.subHeader}>1. Acceptable Use</Text>
        <Text style={styles.paragraph}>
          You agree to use the App in accordance with applicable laws and regulations. You shall not use the App to engage in any unlawful activity.
        </Text>

        <Text style={styles.subHeader}>2. Account Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account credentials and are liable for all activities under your account.
        </Text>

        <Text style={styles.subHeader}>3. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          [MarryUp] is not liable for any damages resulting from the use or inability to use the App, to the fullest extent permitted by law.
        </Text>

        <Text style={styles.subHeader}>4. Prohibited Activities</Text>
        <Text style={styles.subHeader}>You agree not to : </Text>
        <Text style={styles.paragraph}>* Engage in any illegal activity through the app.</Text>
        <Text style={styles.paragraph}>* Upload harmful or offensive content.</Text>
        <Text style={styles.paragraph}> * Impersonate another user. </Text>

        <Text style={styles.subHeader}>5. Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your access to the App at any time if we believe you have violated the terms of service.
        </Text>

        <Text style={styles.subHeader}>6. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms of Service at any time. You will be notified of any changes.
        </Text>

        <View style={styles.line} />

        <Text style={styles.header1}> MarryUp Privacy Policy </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Effective Date:</Text> [05/03/2025]
        </Text>

        <Text style={styles.paragraph}>
          At [MarryUp], we are committed to safeguarding your privacy. This Privacy Policy explains how we collect, store, use, and share your personal information when you use our mobile application. By accessing or using our services, you consent to the practices described in this Privacy Policy.
        </Text>

        <Text style={styles.subHeader}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>We collect the following types of information when you use our app:</Text>

        <Text style={styles.subHeader}>Personal Information:</Text>
        <Text style={styles.paragraph}>
          Name, Email Address, Date of Birth, Last Name, Phone Number, Country, Religion, Gender, College Name, University Name, Occupation, Annual Income, Height, Weight, Hobbies, About You.
        </Text>

        <Text style={styles.subHeader}>Location Data:</Text>
        <Text style={styles.paragraph}>
          We collect location data if you enable location sharing in the app.
        </Text>

        <Text style={styles.subHeader}>Photo Access:</Text>
        <Text style={styles.paragraph}>
          We request access to your device’s photo gallery to upload profile pictures.
        </Text>

        <Text style={styles.subHeader}>Reporting Data:</Text>
        <Text style={styles.paragraph}>
          UserID and report content sent to our review team via EmailJS.
        </Text>

        <Text style={styles.subHeader}>Data Storage:</Text>
        <Text style={styles.paragraph}>
          We store your personal data securely in AWS S3.
        </Text>

        <Text style={styles.subHeader}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>We use your information to:</Text>
        <Text style={styles.paragraph}>- Provide and improve services.</Text>
        <Text style={styles.paragraph}>- Communicate with you for updates and inquiries.</Text>
        <Text style={styles.paragraph}>- Respond to your reports and feedback.</Text>
        <Text style={styles.paragraph}>- Comply with legal obligations.</Text>

        <Text style={styles.subHeader}>3. Liking Profiles</Text>
        <Text style={styles.paragraph}>
          When you like a profile, we record this interaction in our database. This data is associated with your account and may be used to personalize your user experience and provide more relevant content.
        </Text>

        <Text style={styles.subHeader}>4. Sharing Profiles</Text>
        <Text style={styles.paragraph}>
          We allow users to share profiles with others. When you share a profile, we may collect data on the profile you shared and the method of sharing (e.g., social media, email, etc.). Please note that the recipient of the shared profile may have access to your public profile information, depending on the settings of the platform used for sharing.
        </Text>

        <Text style={styles.subHeader}>5. Commenting on Profiles</Text>
        <Text style={styles.paragraph}>
          When you comment on a profile, your comment, along with your username and profile picture, may be publicly visible to others depending on your account settings. Comments may be stored for moderation and to maintain the integrity of our community.
        </Text>

        <Text style={styles.subHeader}>6. Data Security</Text>
        <Text style={styles.paragraph}>
          We use reasonable security measures, including AWS S3, to protect your data. However, please note that no method of data transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </Text>

        <Text style={styles.subHeader}>7. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data only for as long as necessary to fulfill the purposes for which it was collected. Once your data is no longer necessary, it will be securely deleted or anonymized.
        </Text>

        <Text style={styles.subHeader}>8. Your Rights and Choices</Text>
        <Text style={styles.paragraph}>You have the following rights with respect to your personal data:</Text>
        <Text style={styles.paragraph}>- Access: You can request a copy of the personal information we hold about you.</Text>
        <Text style={styles.paragraph}>- Correction: You can update or correct your personal information.</Text>
        <Text style={styles.paragraph}>- Deletion: You can request that we delete your personal data, subject to applicable legal requirements.</Text>
        <Text style={styles.paragraph}>- Opt-out: You can opt-out of certain uses of your data, such as marketing communications.</Text>
        <Text style={styles.paragraph}>
          To exercise these rights, please contact us at [ paulfortuneltd@gmail.com ].
        </Text>

        <Text style={styles.subHeader}>9. Children’s Privacy</Text>
        <Text style={styles.paragraph}>
            we do not knowingly collect personal information from children under this age. If we learn that we have collected personal information from a child under the age of 13 (or 16,18), we will take steps to delete that information as quickly as possible.
        </Text>

        <Text style={styles.subHeader}>10. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be reflected in the updated version of the Privacy Policy, and the "Effective Date" will be revised accordingly. Please review this Privacy Policy periodically for any updates.
        </Text>

        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns about this Privacy Policy, or if you would like to exercise your rights as described above, please contact us at:
        </Text>

        <Text style={styles.paragraph}>
          [ Paul Fortune Ltd. ]
        </Text>
        <Text style={styles.paragraph}>
          Email: [ paulfortuneltd@gmail.com ]
        </Text>
        <Text style={styles.paragraph}>
          Phone: [ +44 7737024736 / 07737024736]
        </Text>
        <Text style={styles.paragraph}>
          Address: [ 4 Charnley road, Blackpool, FY1 2LB]
        </Text>

        <Text style={styles.paragraph}>
          [MarryUp] is committed to protecting your privacy and ensuring that your personal information is secure.
        </Text>
        <View style={styles.line} />
        {/* End User License Agreement (EULA) Section */}
        <Text style={styles.header}>End User License Agreement (EULA)</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Effective Date:</Text> [05/03/2025]
        </Text>

        <Text style={styles.paragraph}>
          This End User License Agreement (EULA) governs the terms and conditions under which you may use the [MarryUp] app (the "App"). By installing, accessing, or using the App, you agree to be bound by these terms.
        </Text>

        <Text style={styles.subHeader}>1. License Grant</Text>
        <Text style={styles.paragraph}>
          Subject to the terms of this agreement, [MarryUp] grants you a limited, non-transferable, non-exclusive license to use the App for personal, non-commercial use on a mobile device you own or control.
        </Text>

        <Text style={styles.subHeader}>2. Restrictions</Text>
        <Text style={styles.paragraph}>
          You may not: (a) reverse engineer, decompile, or disassemble the App; (b) rent, lease, or sublicense the App; (c) use the App for unlawful purposes or in any manner that violates applicable laws.
        </Text>

        <Text style={styles.subHeader}>3. Ownership</Text>
        <Text style={styles.paragraph}>
          [MarryUp] and its licensors retain all ownership and intellectual property rights in and to the App, including all content, code, and features, unless explicitly stated otherwise.
        </Text>

        <Text style={styles.subHeader}>4. Termination</Text>
        <Text style={styles.paragraph}>
          This license is effective until terminated. You may terminate it at any time by deleting the App from your device. [MarryUp] may also terminate this license if you violate any terms of this EULA, and you must stop using the App immediately.
        </Text>

        <Text style={styles.subHeader}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          In no event shall [MarryUp] be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App, even if advised of the possibility of such damages.
        </Text>

        <Text style={styles.subHeader}>6. Indemnification</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify and hold harmless [MarryUp] from any claims, damages, liabilities, costs, and expenses arising from your use of the App or any breach of this EULA.
        </Text>

        <Text style={styles.subHeader}>7. Updates</Text>
        <Text style={styles.paragraph}>
          [MarryUp] may provide updates to the App from time to time. You agree that these updates may be automatically installed and that the terms of this EULA will apply to any updates provided.
        </Text>

        <Text style={styles.subHeader}>8. Governing Law</Text>
        <Text style={styles.paragraph}>
          This EULA shall be governed by the laws of the jurisdiction where [Paul Fortune Ltd. ] is headquartered, without regard to its conflict of law principles.
        </Text>

        <Text style={styles.subHeader}>9. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this EULA, you can contact us at [ paulfortuneltd@gmail.com ].
        </Text>
        <View style={styles.line} />
        <Text style={styles.header}>Child Safety Policy</Text>
        <Text style={styles.paragraph}>
          We are committed to ensuring the safety of children who use our app. Our app is not intended for use by children under the age of 13 (or 16 in certain jurisdictions,including India), and we do not knowingly collect personal information from children under this age. If we learn that we have collected personal information from a child under the age of 13 (or 16,18), we will take steps to delete that information as quickly as possible.
        </Text>

        <Text style={styles.paragraph}>
          If your child is under the required age for using our app, please ensure they do not provide any personal information to us. Parents or guardians can contact us to review, modify, or request the deletion of their child's data.
        </Text>
        <Text style={styles.paragraph}>
          For Indian users, please note that our app complies with local regulations, including those that protect children's online privacy. The legal age of majority in India is 18 years, and we do not collect personal data from individuals under 18 unless with parental or guardian consent.
        </Text>

        <Text style={styles.paragraph}>
          For more information or if you have any concerns about your child’s privacy , you can contact us at [ paulfortuneltd@gmail.com ].
        </Text>
        <Text style={styles.paragraph}> Thank you for using our services. </Text>
        <View style={styles.footerContainer}>
        <Text style={styles.footerText}>© 2025 MarryUp. All Rights Reserved. </Text>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  content: {
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  header1: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
    marginBottom: 10
  },
  bold: {
    fontWeight: 'bold',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,  
    marginBottom: 20,
  },
  footerText: {
    width:'60%',
    fontSize: 12,
    color: '#aaa',
  },
});

export default PrivacyPolicy;
