import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, ProgressBar, Checkbox } from 'react-native-paper';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Compass, ListTodo, Plus } from 'lucide-react-native';

const StudyPlanner = () => {
  const { user, reloadProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [targetExam, setTargetExam] = useState('');
  const [targetJob, setTargetJob] = useState('');
  const [examDate, setExamDate] = useState(''); // YYYY-MM-DD
  const [dailyHours, setDailyHours] = useState('');

  // Local completed tasks checklist state
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleGenerate = async () => {
    if ((!targetExam && !targetJob) || !examDate || !dailyHours) {
      alert('Please fill in exam/role title, target date, and prep hours.');
      return;
    }
    setLoading(true);
    try {
      await aiAPI.updateStudyPlan({
        targetExam,
        targetJob,
        examDate,
        dailyHours: Number(dailyHours)
      });
      await reloadProfile();
    } catch (e) {
      alert('Failed to generate study plan. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (task: string) => {
    if (completedTasks.includes(task)) {
      setCompletedTasks(completedTasks.filter(t => t !== task));
    } else {
      setCompletedTasks([...completedTasks, task]);
    }
  };

  const planner = user?.studyPlanner;
  
  if (planner && planner.dailyTasks && planner.dailyTasks.length > 0) {
    const totalTasks = planner.dailyTasks.length;
    const progress = totalTasks > 0 ? completedTasks.length / totalTasks : 0;

    return (
      <ScrollView contentContainerStyle={styles.plannerContainer}>
        <Card style={styles.planCard}>
          <Card.Content>
            <View style={styles.planHeader}>
              <Compass size={24} color="#1a73e8" />
              <View style={styles.planHeaderTexts}>
                <Text style={styles.planTitle}>{planner.targetExam || planner.targetJob} Target</Text>
                <Text style={styles.planSub}>Exam Date: {new Date(planner.examDate).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Today's Progress: {Math.round(progress * 100)}%</Text>
              <ProgressBar progress={progress} color="#1a73e8" style={styles.progressBar} />
            </View>

            <View style={styles.tasksSection}>
              <Text style={styles.sectionHeader}>📋 Daily Tasks Checklist</Text>
              {planner.dailyTasks.map((task: string, i: number) => {
                const isChecked = completedTasks.includes(task);
                return (
                  <View key={i} style={styles.taskItem}>
                    <Checkbox
                      status={isChecked ? 'checked' : 'unchecked'}
                      onPress={() => toggleTask(task)}
                      color="#1a73e8"
                    />
                    <Text style={[styles.taskText, isChecked ? styles.taskTextChecked : null]}>{task}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.targetsSection}>
              <Text style={styles.sectionHeader}>🎯 Weekly Milestones</Text>
              {planner.weeklyTargets.map((target: string, i: number) => (
                <Text key={i} style={styles.targetItem}>• {target}</Text>
              ))}
            </View>

            <Button
              mode="outlined"
              onPress={() => {
                // Clear planner from local state to redefine
                if (user) user.studyPlanner = undefined;
                setTargetExam('');
                setTargetJob('');
                setExamDate('');
                setDailyHours('');
                setCompletedTasks([]);
              }}
              style={styles.recreateBtn}
            >
              Reset / Change Plan
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.formTitle}>Setup Study Planner 📅</Text>
          <Text style={styles.formSub}>Enter your milestones and CareerVerse AI will construct a 30-day prep checklist.</Text>

          <TextInput
            label="Target Exam (e.g. GATE, SSC CGL)"
            value={targetExam}
            onChangeText={setTargetExam}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Target Job/Role (e.g. AI Engineer)"
            value={targetJob}
            onChangeText={setTargetJob}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Target Date (YYYY-MM-DD)"
            value={examDate}
            onChangeText={setExamDate}
            mode="outlined"
            style={styles.input}
            placeholder="e.g. 2026-10-15"
          />

          <TextInput
            label="Daily Prep Hours Available"
            value={dailyHours}
            onChangeText={setDailyHours}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g. 3"
          />

          <Button
            mode="contained"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
            style={styles.generateBtn}
            icon={() => <ListTodo size={20} color="#ffffff" />}
          >
            Generate AI Study Plan
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default StudyPlanner;

const styles = StyleSheet.create({
  plannerContainer: {
    padding: 16
  },
  planCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff'
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  planHeaderTexts: {
    marginLeft: 12
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124'
  },
  planSub: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2
  },
  progressSection: {
    marginBottom: 24
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  },
  tasksSection: {
    marginBottom: 24
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingBottom: 6
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 10
  },
  taskText: {
    fontSize: 13,
    color: '#3c4043',
    flex: 1
  },
  taskTextChecked: {
    textDecorationLine: 'line-through',
    color: '#9aa0a6'
  },
  targetsSection: {
    marginBottom: 20
  },
  targetItem: {
    fontSize: 13,
    color: '#3c4043',
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 8
  },
  recreateBtn: {
    borderColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 10
  },
  formContainer: {
    padding: 16
  },
  formCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff'
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  formSub: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 18,
    marginBottom: 20
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff'
  },
  generateBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 10,
    height: 48,
    justifyContent: 'center'
  }
});
