import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Button, SegmentedButtons, IconButton, ProgressBar } from 'react-native-paper';
import { coreAPI } from '../services/api';
import { GraduationCap, Timer, ChevronLeft, ChevronRight, Award, Compass } from 'lucide-react-native';

const Tests = () => {
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Placement' | 'Government Exams' | 'Higher Studies'>('Placement');

  // Test views state: 'list' | 'active_test' | 'result'
  const [viewState, setViewState] = useState<'list' | 'active_test' | 'result'>('list');

  // Lists
  const [tests, setTests] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);

  // Active Test States
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Result States
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    fetchTests();
    fetchAnalytics();
  }, [activeCategory]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await coreAPI.getTests(activeCategory);
      setTests(response.data);
    } catch (e) {
      console.error('Error fetching tests:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await coreAPI.getTestAnalytics();
      setAnalytics(response.data);
    } catch (e) {
      console.error('Error loading analytics:', e);
    }
  };

  // Start Test Logic
  const startTest = (test: any) => {
    setSelectedTest(test);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setMarkedForReview({});
    setSecondsRemaining(test.duration * 60);
    setViewState('active_test');

    // Start Timer Interval
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          alert("Time is up! Submitting test automatically...");
          submitTestAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Force Auto-Submit when time finishes
  const submitTestAuto = async () => {
    if (!selectedTest) return;
    setLoading(true);
    try {
      const timeTaken = selectedTest.duration * 60 - secondsRemaining;
      const response = await coreAPI.submitTest(selectedTest._id, userAnswers, timeTaken);
      setTestResult(response.data);
      setViewState('result');
      fetchAnalytics();
    } catch (e) {
      alert("Failed to submit test automatically.");
    } finally {
      setLoading(false);
    }
  };

  // Manual Submit
  const handleManualSubmit = () => {
    const unansweredCount = selectedTest.questions.length - Object.keys(userAnswers).length;
    if (unansweredCount > 0) {
      const confirm = window.confirm ? window.confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`) : true;
      if (!confirm) return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    submitTestAuto();
  };

  // Option Click
  const selectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIdx
    });
  };

  const toggleMarkReview = (questionId: string) => {
    setMarkedForReview({
      ...markedForReview,
      [questionId]: !markedForReview[questionId]
    });
  };

  // Format MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute overall readiness metrics for diagnostic panels
  const categoryAnalytics = analytics.filter(a => a.testId?.category === activeCategory || a.testId === selectedTest?._id);
  const avgAccuracy = categoryAnalytics.length > 0
    ? Math.round(categoryAnalytics.reduce((acc, a) => acc + a.accuracy, 0) / categoryAnalytics.length)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. LIST VIEW */}
      {viewState === 'list' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.heading}>Practice & Assessments</Text>

          {/* Category Selector Segment */}
          <SegmentedButtons
            value={activeCategory}
            onValueChange={(val: any) => setActiveCategory(val)}
            buttons={[
              { value: 'Placement', label: 'Placement' },
              { value: 'Government Exams', label: 'Gov Exams' },
              { value: 'Higher Studies', label: 'Higher Studies' }
            ]}
            style={styles.segmentedButtons}
          />

          {/* Exam Readiness Tracker widget */}
          <Card style={styles.readinessCard}>
            <Card.Content>
              <Text style={styles.readinessTitle}>{activeCategory} Exam Readiness</Text>
              <Text style={styles.readinessPercentage}>{avgAccuracy || 60}%</Text>
              <ProgressBar progress={(avgAccuracy || 60) / 100} color="#1a73e8" style={styles.progressBar} />
              <Text style={styles.readinessMeta}>Based on {categoryAnalytics.length} attempted mock tests.</Text>
            </Card.Content>
          </Card>

          <Text style={styles.sectionHeading}>Available Tests</Text>

          {loading ? (
            <ActivityIndicator size="medium" color="#1a73e8" style={{ marginTop: 20 }} />
          ) : tests.length > 0 ? (
            tests.map((test) => (
              <Card key={test._id} style={styles.testCard}>
                <Card.Content style={styles.testCardContent}>
                  <View style={styles.testInfo}>
                    <GraduationCap size={24} color="#1a73e8" />
                    <View style={styles.testTextContainer}>
                      <Text style={styles.testTitle}>{test.title}</Text>
                      <Text style={styles.testMeta}>{test.questions?.length || 0} Questions • {test.duration} mins</Text>
                    </View>
                  </View>
                  <Button mode="contained" onPress={() => startTest(test)} style={styles.startBtn}>
                    Start
                  </Button>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No mock tests available in this category yet.</Text>
          )}

          {/* Mock History Analytics logs */}
          {categoryAnalytics.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.sectionHeading}>Attempt History</Text>
              {categoryAnalytics.slice(0, 3).map((item, idx) => (
                <Card key={idx} style={styles.historyCard}>
                  <Card.Content style={styles.historyCardContent}>
                    <View>
                      <Text style={styles.historyTitle}>{item.testId?.title || 'Mock Test'}</Text>
                      <Text style={styles.historyMeta}>Score: {item.score} • Accuracy: {item.accuracy}%</Text>
                    </View>
                    <Award size={20} color="#f9ab00" />
                  </Card.Content>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* 2. ACTIVE TEST INTERFACE */}
      {viewState === 'active_test' && selectedTest && (
        <View style={styles.testContainer}>
          {/* Header row with duration countdown */}
          <View style={styles.testHeader}>
            <View style={styles.timerRow}>
              <Timer size={18} color="#d93025" />
              <Text style={styles.timerText}> {formatTime(secondsRemaining)}</Text>
            </View>
            <Text style={styles.questionCounter}>Question {currentQuestionIdx + 1} / {selectedTest.questions.length}</Text>
          </View>

          {/* Current Question */}
          <ScrollView contentContainerStyle={styles.questionArea}>
            <Text style={styles.questionSubject}>{selectedTest.questions[currentQuestionIdx].subject}</Text>
            <Text style={styles.questionText}>{selectedTest.questions[currentQuestionIdx].text}</Text>

            {selectedTest.questions[currentQuestionIdx].options.map((option: string, idx: number) => {
              const questionId = selectedTest.questions[currentQuestionIdx]._id;
              const isSelected = userAnswers[questionId] === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => selectOption(questionId, idx)}
                  style={[
                    styles.optionBtn,
                    isSelected ? styles.optionSelected : null
                  ]}
                >
                  <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Mark for review and navigation controls */}
          <View style={styles.testFooter}>
            <TouchableOpacity onPress={() => toggleMarkReview(selectedTest.questions[currentQuestionIdx]._id)} style={styles.reviewBtn}>
              <Text style={[styles.reviewText, markedForReview[selectedTest.questions[currentQuestionIdx]._id] ? { color: '#f9ab00' } : null]}>
                {markedForReview[selectedTest.questions[currentQuestionIdx]._id] ? '★ Marked' : '☆ Mark for Review'}
              </Text>
            </TouchableOpacity>

            <View style={styles.navRow}>
              {currentQuestionIdx > 0 ? (
                <IconButton icon={() => <ChevronLeft size={24} color="#1a73e8" />} onPress={() => setCurrentQuestionIdx(currentQuestionIdx - 1)} />
              ) : (
                <View style={{ width: 48 }} />
              )}

              {currentQuestionIdx < selectedTest.questions.length - 1 ? (
                <IconButton icon={() => <ChevronRight size={24} color="#1a73e8" />} onPress={() => setCurrentQuestionIdx(currentQuestionIdx + 1)} />
              ) : (
                <Button mode="contained" onPress={handleManualSubmit} style={styles.submitTestBtn}>
                  Submit Test
                </Button>
              )}
            </View>
          </View>
        </View>
      )}

      {/* 3. TEST RESULT DASHBOARD */}
      {viewState === 'result' && testResult && (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Card style={styles.resultCard}>
            <Card.Content>
              <View style={styles.resultHeader}>
                <Award size={36} color="#f9ab00" />
                <Text style={styles.resultHeaderTitle}>Mock Test Scorecard</Text>
              </View>

              <View style={styles.scoreSummary}>
                <View style={styles.scoreBlock}>
                  <Text style={styles.scoreLabel}>Final Score</Text>
                  <Text style={styles.scoreVal}>{testResult.score}</Text>
                </View>
                <View style={styles.scoreBlock}>
                  <Text style={styles.scoreLabel}>Accuracy</Text>
                  <Text style={styles.scoreVal}>{testResult.accuracy}%</Text>
                </View>
              </View>

              <View style={styles.breakdownRow}>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Correct</Text>
                  <Text style={[styles.breakdownVal, { color: '#34a853' }]}>{testResult.correctAnswersCount}</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Wrong</Text>
                  <Text style={[styles.breakdownVal, { color: '#ea4335' }]}>{testResult.wrongAnswersCount}</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Skipped</Text>
                  <Text style={styles.breakdownVal}>{testResult.skippedQuestionsCount}</Text>
                </View>
              </View>

              {/* Strong and Weak areas lists */}
              <View style={styles.diagnostics}>
                <Text style={styles.diagTitle}>Strong Areas:</Text>
                <Text style={styles.diagText}>{testResult.strongAreas.join(', ') || 'N/A'}</Text>
                
                <Text style={styles.diagTitle}>Weak Areas:</Text>
                <Text style={styles.diagText}>{testResult.weakAreas.join(', ') || 'N/A'}</Text>
              </View>

              {/* AI Diagnostic suggestions */}
              <View style={styles.aiBox}>
                <View style={styles.aiBoxHeader}>
                  <Compass size={18} color="#1a73e8" />
                  <Text style={styles.aiBoxTitle}>AI Recommendations</Text>
                </View>
                <Text style={styles.aiBoxText}>{testResult.aiRecommendation}</Text>
              </View>

              <Button mode="contained" onPress={() => setViewState('list')} style={styles.doneBtn}>
                Done
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Tests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 16
  },
  segmentedButtons: {
    marginBottom: 20,
    backgroundColor: '#ffffff'
  },
  readinessCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  readinessTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  readinessPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a73e8',
    marginBottom: 8
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  readinessMeta: {
    fontSize: 11,
    color: '#5f6368'
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  testCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  testInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  testTextContainer: {
    marginLeft: 16
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124'
  },
  testMeta: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4
  },
  startBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8
  },
  emptyText: {
    color: '#5f6368',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8
  },
  historyCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124'
  },
  historyMeta: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4
  },
  testContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#ffffff'
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d93025'
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124'
  },
  questionArea: {
    padding: 20,
    paddingBottom: 40
  },
  questionSubject: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a73e8',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  questionText: {
    fontSize: 17,
    color: '#202124',
    fontWeight: '500',
    lineHeight: 26,
    marginBottom: 24
  },
  optionBtn: {
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12
  },
  optionSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#f8fafd'
  },
  optionText: {
    fontSize: 14,
    color: '#3c4043',
    fontWeight: '500'
  },
  optionTextSelected: {
    color: '#1a73e8'
  },
  testFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reviewBtn: {},
  reviewText: {
    fontSize: 13,
    color: '#5f6368',
    fontWeight: '600'
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  submitTestBtn: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    marginLeft: 12
  },
  resultContainer: {
    padding: 16
  },
  resultCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff'
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  resultHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginLeft: 16
  },
  scoreSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  scoreBlock: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4
  },
  scoreLabel: {
    fontSize: 11,
    color: '#5f6368',
    marginBottom: 6
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202124'
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingBottom: 16
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#5f6368',
    marginBottom: 4
  },
  breakdownVal: {
    fontSize: 16,
    fontWeight: '700'
  },
  diagnostics: {
    marginBottom: 20
  },
  diagTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  diagText: {
    fontSize: 13,
    color: '#5f6368',
    marginBottom: 14,
    lineHeight: 18
  },
  aiBox: {
    backgroundColor: '#e8f0fe',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20
  },
  aiBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  aiBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a73e8',
    marginLeft: 8
  },
  aiBoxText: {
    fontSize: 12,
    color: '#3c4043',
    lineHeight: 18
  },
  doneBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8
  }
});
