import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { Briefcase, GraduationCap, Building2, ClipboardList, Laptop, Code, Check } from 'lucide-react-native';

const goalOptions = [
  {
    id: 'Campus Placement',
    title: 'Campus Placement',
    description: 'Prepare for company placements, coding rounds and technical interviews.',
    icon: Briefcase,
    color: '#e8f0fe',
    iconColor: '#1a73e8'
  },
  {
    id: 'Higher Studies',
    title: 'Higher Studies',
    description: 'Prepare for GATE, GRE, CAT, IELTS, MS, M.Tech and PhD.',
    icon: GraduationCap,
    color: '#fef7e0',
    iconColor: '#f9ab00'
  },
  {
    id: 'Government Jobs',
    title: 'Government Jobs',
    description: 'Discover government recruitment, vacancies, exams and notifications.',
    icon: Building2,
    color: '#e6f4ea',
    iconColor: '#1e8e3e'
  },
  {
    id: 'Competitive Exams',
    title: 'Competitive Exams',
    description: 'Prepare for UPSC, SSC, TNPSC, Banking, Railway and Defense boards.',
    icon: ClipboardList,
    color: '#fce8e6',
    iconColor: '#d93025'
  },
  {
    id: 'Internships',
    title: 'Internships',
    description: 'Discover internships, paid stipends and industrial apprenticeships.',
    icon: Laptop,
    color: '#f3e8fd',
    iconColor: '#a87ffb'
  },
  {
    id: 'Skill Development',
    title: 'Skill Development',
    description: 'Master core technical stack, system design, and professional skills.',
    icon: Code,
    color: '#e2f5f9',
    iconColor: '#00acc1'
  }
];

const GoalSelection = ({ navigation }: any) => {
  const { updateGoals } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) {
      alert('Please select at least one goal to personalize your feed.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateGoals(selectedGoals);
      navigation.navigate('EducationSetup');
    } catch (error: any) {
      alert(error.message || 'Failed to update goals.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>What are you preparing for?</Text>
          <Text style={styles.subtitle}>Select one or more goals. We'll personalize your CareerVerse experience.</Text>
        </View>

        <View style={styles.grid}>
          {goalOptions.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const Icon = goal.icon;
            return (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                style={[
                  styles.card,
                  isSelected ? { borderColor: '#1a73e8', backgroundColor: '#f8fafd' } : null
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
                    <Icon size={24} color={goal.iconColor} />
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="#ffffff" />
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle}>{goal.title}</Text>
                <Text style={styles.cardDescription}>{goal.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          mode="contained"
          onPress={handleContinue}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.continueBtn}
          contentStyle={{ height: 48 }}
        >
          Continue
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalSelection;

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
    marginBottom: 28
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  card: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkmark: {
    backgroundColor: '#1a73e8',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 18
  },
  continueBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 10
  }
});
