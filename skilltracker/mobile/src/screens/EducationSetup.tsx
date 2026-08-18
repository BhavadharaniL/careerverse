import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react-native';

const EducationSetup = ({ navigation }: any) => {
  const { updateEducation, isLoading } = useAuth();
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [college, setCollege] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!degree || !department || !college || !currentYear || !graduationYear) {
      setErrorMsg('Please fill in all academic details.');
      return;
    }
    setErrorMsg('');
    
    // Parse comma separated strings
    const currentSkills = skills
      ? skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
      : [];
    const areasOfInterest = interests
      ? interests.split(',').map((i) => i.trim()).filter((i) => i.length > 0)
      : [];

    try {
      await updateEducation(
        {
          degree,
          department,
          college,
          currentYear,
          graduationYear,
          location,
          currentSkills,
          areasOfInterest
        },
        targetCareer || 'Software Engineer' // default target if empty
      );
      // Success will automatically route to MainApp in AppNavigator since user.goals and user.education are loaded!
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to update education details.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Education Profile 🎓</Text>
          <Text style={styles.subtitle}>Help us personalize roadmaps, exams, and scholarship discovery for you.</Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.form}>
          <TextInput
            label="Degree (e.g. B.E / B.Tech, B.Sc)"
            value={degree}
            onChangeText={setDegree}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <TextInput
            label="Department (e.g. Computer Science)"
            value={department}
            onChangeText={setDepartment}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <TextInput
            label="College Name"
            value={college}
            onChangeText={setCollege}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
          />

          <View style={styles.row}>
            <TextInput
              label="Current Year"
              value={currentYear}
              onChangeText={setCurrentYear}
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              outlineColor="#dadce0"
              activeOutlineColor="#1a73e8"
              placeholder="e.g. 3rd Year"
            />

            <TextInput
              label="Graduation Year"
              value={graduationYear}
              onChangeText={setGraduationYear}
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
              outlineColor="#dadce0"
              activeOutlineColor="#1a73e8"
              keyboardType="numeric"
              placeholder="e.g. 2027"
            />
          </View>

          <TextInput
            label="Target Career (e.g. AI Engineer, Web Developer)"
            value={targetCareer}
            onChangeText={setTargetCareer}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
            placeholder="What is your dream role?"
          />

          <TextInput
            label="Your Current Skills (comma separated)"
            value={skills}
            onChangeText={setSkills}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
            placeholder="Python, Java, Git, SQL"
          />

          <TextInput
            label="Areas of Interest (comma separated)"
            value={interests}
            onChangeText={setInterests}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
            placeholder="AI, Cloud Computing, Backend"
          />

          <TextInput
            label="Current Location (City, State)"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            style={styles.input}
            outlineColor="#dadce0"
            activeOutlineColor="#1a73e8"
            placeholder="Chennai, Tamil Nadu"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitBtn}
            contentStyle={{ height: 48 }}
            icon={() => <GraduationCap size={20} color="#ffffff" />}
          >
            Complete Setup
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EducationSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  header: {
    marginTop: 30,
    marginBottom: 24
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    lineHeight: 24
  },
  errorText: {
    color: '#d93025',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#fce8e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center'
  },
  form: {
    marginBottom: 24
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 16
  }
});
