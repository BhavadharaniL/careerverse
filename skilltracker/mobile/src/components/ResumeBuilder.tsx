import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Check, Clipboard, AlertCircle } from 'lucide-react-native';

const ResumeBuilder = () => {
  const { reloadProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Form Fields
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState('');
  const [experience, setExperience] = useState('');
  const [achievements, setAchievements] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAudit = async () => {
    setLoading(true);
    try {
      const resumeData = {
        fullname,
        email,
        phone,
        education: { degree, college },
        skills: skills.split(','),
        projects,
        experience,
        achievements
      };
      
      const response = await aiAPI.submitResumeAudit(resumeData);
      setAuditResult(response.data);
      // Reload profile to reflect newly unlocked resume badges/XP
      await reloadProfile();
    } catch (e) {
      alert('Error auditing resume. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetBuilder = () => {
    setStep(1);
    setAuditResult(null);
  };

  if (auditResult) {
    return (
      <ScrollView contentContainerStyle={styles.auditContainer}>
        <Card style={styles.auditCard}>
          <Card.Content>
            <View style={styles.auditHeader}>
              <Check size={28} color="#34a853" />
              <Text style={styles.auditHeaderTitle}>AI Resume Critique Completed</Text>
            </View>
            
            <Text style={styles.critiqueTitle}>ATS Diagnostic Advice:</Text>
            <Text style={styles.critiqueText}>{auditResult.atsRecommendation}</Text>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletHeader}>💡 Formatting Suggestions:</Text>
              {auditResult.formattingSuggestions.map((item: string, i: number) => (
                <Text key={i} style={styles.bulletItem}>• {item}</Text>
              ))}
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletHeader}>🔍 Missing ATS Keywords:</Text>
              {auditResult.missingKeywords.map((item: string, i: number) => (
                <Text key={i} style={styles.bulletItem}>• {item}</Text>
              ))}
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletHeader}>📈 Skill Suggestions for Target Roles:</Text>
              {auditResult.skillSuggestions.map((item: string, i: number) => (
                <Text key={i} style={styles.bulletItem}>• {item}</Text>
              ))}
            </View>

            <Button mode="contained" onPress={resetBuilder} style={styles.resetBtn}>
              Create New Resume
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.stepperHeader}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.stepBubbleRow}>
            <View style={[styles.stepBubble, step >= i ? styles.stepBubbleActive : null]}>
              <Text style={[styles.stepText, step >= i ? styles.stepTextActive : null]}>{i}</Text>
            </View>
            {i < 4 && <View style={[styles.stepConnector, step > i ? styles.stepConnectorActive : null]} />}
          </View>
        ))}
      </View>

      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>1. Personal & Contact Details</Text>
          <TextInput label="Full Name" value={fullname} onChangeText={setFullname} mode="outlined" style={styles.input} />
          <TextInput label="Email Address" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
          <TextInput label="Phone Number" value={phone} onChangeText={setPhone} mode="outlined" style={styles.input} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>2. Education Details</Text>
          <TextInput label="Degree (e.g. B.E in CS)" value={degree} onChangeText={setDegree} mode="outlined" style={styles.input} />
          <TextInput label="College Name" value={college} onChangeText={setCollege} mode="outlined" style={styles.input} />
          <TextInput label="Current Skills (comma separated)" value={skills} onChangeText={setSkills} mode="outlined" style={styles.input} placeholder="Python, JavaScript, SQL" />
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>3. Projects & Work Experience</Text>
          <TextInput label="Projects (Details & Tech Stack)" value={projects} onChangeText={setProjects} mode="outlined" style={styles.input} multiline numberOfLines={5} placeholder="E.g. Chat application using Node.js & React" />
          <TextInput label="Experience (Internships, Job roles)" value={experience} onChangeText={setExperience} mode="outlined" style={styles.input} multiline numberOfLines={5} placeholder="E.g. Web Development Intern at XYZ Systems" />
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>4. Achievements & Links</Text>
          <TextInput label="Achievements (Awards, Ranks)" value={achievements} onChangeText={setAchievements} mode="outlined" style={styles.input} multiline numberOfLines={5} placeholder="E.g. 1st Rank in Hackathon, Leetcode 500+ solved" />
          
          <View style={styles.disclaimer}>
            <AlertCircle size={16} color="#5f6368" />
            <Text style={styles.disclaimerText}>CareerVerse AI will run a structural ATS evaluation check on your inputs.</Text>
          </View>
        </View>
      )}

      <View style={styles.actionRow}>
        {step > 1 ? (
          <Button mode="outlined" onPress={handlePrev} style={styles.navBtn}>
            Back
          </Button>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {step < 4 ? (
          <Button mode="contained" onPress={handleNext} style={[styles.navBtn, { backgroundColor: '#1a73e8' }]}>
            Next
          </Button>
        ) : (
          <Button mode="contained" onPress={handleAudit} loading={loading} disabled={loading} style={[styles.navBtn, { backgroundColor: '#34a853' }]}>
            Analyze ATS
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

export default ResumeBuilder;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff'
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  stepBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dadce0',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepBubbleActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#1a73e8'
  },
  stepText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '700'
  },
  stepTextActive: {
    color: '#ffffff'
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: '#dadce0'
  },
  stepConnectorActive: {
    backgroundColor: '#1a73e8'
  },
  stepContent: {
    marginBottom: 30
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 20
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff'
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  disclaimerText: {
    fontSize: 11,
    color: '#5f6368',
    marginLeft: 8,
    flex: 1
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8
  },
  auditContainer: {
    padding: 16
  },
  auditCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff'
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  auditHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginLeft: 12
  },
  critiqueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  critiqueText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 22,
    marginBottom: 20
  },
  bulletSection: {
    marginBottom: 16
  },
  bulletHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 6
  },
  bulletItem: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20,
    marginLeft: 12
  },
  resetBtn: {
    backgroundColor: '#1a73e8',
    marginTop: 20,
    borderRadius: 8
  }
});
