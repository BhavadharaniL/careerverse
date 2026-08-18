import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Card, Avatar, Button, IconButton } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { coreAPI } from '../services/api';
import AIChatBot from '../components/AIChatBot';
import { Calendar, Award, BookOpen, Star, Sparkles, MessageCircle, RefreshCw } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

const Home = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [activeChallengeQuestion, setActiveChallengeQuestion] = useState<any>(null);
  const [selectedChallengeAnswer, setSelectedChallengeAnswer] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await coreAPI.getFeed();
      setFeedData(response.data);
    } catch (e: any) {
      console.error('Error loading dashboard feed:', e);
      setErrorMsg(e.response?.data?.message || e.message || 'Failed to fetch personalized feed data.');
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = (questions: any[]) => {
    if (questions && questions.length > 0) {
      setActiveChallengeQuestion(questions[0]);
      setSelectedChallengeAnswer(null);
      setChallengeSubmitted(false);
      setChallengeModalVisible(true);
    } else {
      alert("No challenge available today. Please check again later!");
    }
  };

  const handleChallengeSubmit = () => {
    if (selectedChallengeAnswer === null) {
      alert("Please select an option before submitting!");
      return;
    }
    setChallengeSubmitted(true);
    // Add XP to user state as reward
    if (selectedChallengeAnswer === activeChallengeQuestion.correctOptionIndex) {
      if (user) {
        user.xp += 10;
        alert("Correct! You earned +10 XP 🌟");
      }
    } else {
      alert(`Oops, that was incorrect! The correct answer is: ${activeChallengeQuestion.options[activeChallengeQuestion.correctOptionIndex]}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>Personalizing your CareerVerse feed...</Text>
      </View>
    );
  }

  if (errorMsg || !feedData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#d93025', fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
          API Connection Issue
        </Text>
        <Text style={{ color: '#5f6368', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 }}>
          {errorMsg || 'No feed data received from the backend.'}
        </Text>
        <Button mode="contained" onPress={fetchFeed} style={{ borderRadius: 8 }}>
          Retry Fetch Feed
        </Button>
      </View>
    );
  }

  // Circular gauge config
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const readinessPercent = feedData.readiness.score;
  const strokeDashoffset = circumference - (readinessPercent / 100) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.username}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={() => logout()} style={styles.avatarBtn} title="Sign Out">
          <Avatar.Text size={44} label={user?.name.substring(0, 2).toUpperCase() || 'CV'} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Career Readiness circular gauge card */}
        <Card style={styles.readinessCard}>
          <Card.Content style={styles.readinessContent}>
            <View style={styles.readinessLeft}>
              <Text style={styles.readinessTitle}>Career Readiness</Text>
              <Text style={styles.readinessSub}>Combined index based on goals & metrics.</Text>
              
              <View style={styles.subMetricsContainer}>
                <View style={styles.subMetric}>
                  <Text style={styles.subMetricLabel}>Skills:</Text>
                  <Text style={styles.subMetricValue}>{feedData.readiness.skills}%</Text>
                </View>
                <View style={styles.subMetric}>
                  <Text style={styles.subMetricLabel}>Tests:</Text>
                  <Text style={styles.subMetricValue}>{feedData.readiness.preparation}%</Text>
                </View>
                <View style={styles.subMetric}>
                  <Text style={styles.subMetricLabel}>Streak:</Text>
                  <Text style={styles.subMetricValue}>{user?.streak} Days 🔥</Text>
                </View>
              </View>
            </View>

            <View style={styles.readinessRight}>
              <Svg width={120} height={120} viewBox="0 0 120 120">
                <Circle cx={60} cy={60} r={radius} stroke="#dadce0" strokeWidth={strokeWidth} fill="transparent" />
                <Circle
                  cx={60}
                  cy={60}
                  r={radius}
                  stroke="#1a73e8"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </Svg>
              <Text style={styles.gaugeText}>{readinessPercent}%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Continue Learning card */}
        {feedData.continueLearning && feedData.continueLearning.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            {feedData.continueLearning.map((item: any) => (
              <Card key={item.id} style={styles.learningCard} onPress={() => navigation.navigate('Learn')}>
                <Card.Content style={styles.learningContent}>
                  <View style={styles.learningLeft}>
                    <BookOpen size={24} color="#1a73e8" />
                    <View style={styles.learningTexts}>
                      <Text style={styles.learningTitle}>{item.title}</Text>
                      <Text style={styles.learningProgress}>Syllabus Progress: {item.progress || 0}%</Text>
                    </View>
                  </View>
                  <Button mode="contained" onPress={() => navigation.navigate('Learn')} style={styles.continueBtn}>
                    Study
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Daily Challenge card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Challenge</Text>
          <Card style={styles.challengeCard}>
            <Card.Content style={styles.challengeContent}>
              <View style={styles.challengeLeft}>
                <Sparkles size={24} color="#f9ab00" />
                <View style={styles.challengeTexts}>
                  <Text style={styles.challengeHeader}>Today's Aptitude & Core Challenge</Text>
                  <Text style={styles.challengeSub}>Answer 1 quick diagnostic question to keep streak.</Text>
                </View>
              </View>
              <Button mode="contained" onPress={() => startChallenge(feedData.dailyChallenge.questions)} style={styles.challengeBtn}>
                Solve
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Upcoming Deadlines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          {feedData.deadlines && feedData.deadlines.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {feedData.deadlines.map((item: any) => {
                let badgeColor = '#e3f2fd';
                let textColor = '#1a73e8';
                if (item.urgency === 'Critical') {
                  badgeColor = '#fce8e6';
                  textColor = '#d93025';
                } else if (item.urgency === 'Upcoming') {
                  badgeColor = '#fef7e0';
                  textColor = '#f9ab00';
                }
                return (
                  <Card key={item.id} style={styles.deadlineCard} onPress={() => navigation.navigate('Opportunities')}>
                    <Card.Content>
                      <View style={[styles.urgencyBadge, { backgroundColor: badgeColor }]}>
                        <Text style={[styles.urgencyText, { color: textColor }]}>{item.urgency}</Text>
                      </View>
                      <Text numberOfLines={1} style={styles.deadlineTitle}>{item.title}</Text>
                      <Text numberOfLines={1} style={styles.deadlineOrg}>{item.organization}</Text>
                      <View style={styles.deadlineDaysRow}>
                        <Calendar size={14} color="#5f6368" />
                        <Text style={styles.deadlineDays}> {item.daysLeft} days remaining</Text>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No deadlines saved yet.</Text>
          )}
        </View>

        {/* Recommended For You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          {feedData.recommendations && feedData.recommendations.length > 0 ? (
            feedData.recommendations.map((item: any) => (
              <Card key={item._id} style={styles.recCard} onPress={() => navigation.navigate('Opportunities')}>
                <Card.Content style={styles.recContent}>
                  <View style={styles.recLeft}>
                    <Text style={styles.recTitle}>{item.title}</Text>
                    <Text style={styles.recOrg}>{item.organization} • {item.location}</Text>
                    <Text style={styles.recTag}>{item.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <IconButton icon="chevron-right" size={24} iconColor="#1a73e8" />
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No recommendation matching your goals.</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating AI chat assistant widget button */}
      <TouchableOpacity style={styles.chatFloatingBtn} onPress={() => setChatVisible(true)}>
        <Sparkles size={20} color="#ffffff" style={styles.chatSparkleIcon} />
        <MessageCircle size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* AI Chat Bot Overlay Screen */}
      <Modal visible={chatVisible} animationType="slide" onRequestClose={() => setChatVisible(false)}>
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>CareerVerse AI Guide</Text>
            <IconButton icon="close" size={24} onPress={() => setChatVisible(false)} />
          </View>
          <AIChatBot />
        </View>
      </Modal>

      {/* Daily Challenge Modal */}
      <Modal visible={challengeModalVisible} animationType="slide" transparent={true} onRequestClose={() => setChallengeModalVisible(false)}>
        <View style={styles.challengeModalOverlay}>
          <View style={styles.challengeModalContent}>
            <View style={styles.challengeModalHeader}>
              <Text style={styles.challengeModalTitle}>Today's Challenge</Text>
              <IconButton icon="close" size={24} onPress={() => setChallengeModalVisible(false)} />
            </View>
            
            {activeChallengeQuestion && (
              <ScrollView style={styles.challengeScroll}>
                <Text style={styles.challengeSubject}>{activeChallengeQuestion.subject}</Text>
                <Text style={styles.challengeQuestionText}>{activeChallengeQuestion.text}</Text>
                
                {activeChallengeQuestion.options.map((option: string, index: number) => {
                  let optStyle = styles.challengeOption;
                  if (selectedChallengeAnswer === index) {
                    optStyle = [styles.challengeOption, styles.challengeOptionSelected];
                  }
                  if (challengeSubmitted) {
                    if (index === activeChallengeQuestion.correctOptionIndex) {
                      optStyle = [styles.challengeOption, styles.challengeOptionCorrect];
                    } else if (selectedChallengeAnswer === index) {
                      optStyle = [styles.challengeOption, styles.challengeOptionIncorrect];
                    }
                  }
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => !challengeSubmitted && setSelectedChallengeAnswer(index)}
                      style={optStyle}
                      disabled={challengeSubmitted}
                    >
                      <Text style={styles.challengeOptionText}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}

                {challengeSubmitted && (
                  <View style={styles.challengeExplanationContainer}>
                    <Text style={styles.challengeExplanationTitle}>Explanation:</Text>
                    <Text style={styles.challengeExplanationText}>{activeChallengeQuestion.explanation}</Text>
                  </View>
                )}
              </ScrollView>
            )}

            {!challengeSubmitted ? (
              <Button mode="contained" onPress={handleChallengeSubmit} style={styles.challengeModalSubmitBtn}>
                Submit Answer
              </Button>
            ) : (
              <Button mode="outlined" onPress={() => setChallengeModalVisible(false)} style={styles.challengeModalCloseBtn}>
                Close Challenge
              </Button>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  loadingText: {
    marginTop: 16,
    color: '#5f6368',
    fontSize: 15,
    fontWeight: '500'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  headerLeft: {},
  greeting: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500'
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginTop: 2
  },
  avatarBtn: {},
  avatar: {
    backgroundColor: '#1a73e8'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  readinessCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  readinessContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  readinessLeft: {
    flex: 1
  },
  readinessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  readinessSub: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 16
  },
  subMetricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  subMetric: {
    marginRight: 16,
    marginBottom: 8
  },
  subMetricLabel: {
    fontSize: 11,
    color: '#5f6368'
  },
  subMetricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202124',
    marginTop: 2
  },
  readinessRight: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  gaugeText: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: '800',
    color: '#1a73e8'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12
  },
  learningCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  learningContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  learningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  learningTexts: {
    marginLeft: 12
  },
  learningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124'
  },
  learningProgress: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4
  },
  continueBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8
  },
  challengeCard: {
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe0b2'
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  challengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  challengeTexts: {
    marginLeft: 12,
    flex: 1
  },
  challengeHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b26a00'
  },
  challengeSub: {
    fontSize: 11,
    color: '#5f6368',
    marginTop: 2
  },
  challengeBtn: {
    backgroundColor: '#f9ab00',
    borderRadius: 8
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingVertical: 4
  },
  deadlineCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700'
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  deadlineOrg: {
    fontSize: 11,
    color: '#5f6368',
    marginBottom: 12
  },
  deadlineDaysRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deadlineDays: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '500'
  },
  recCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  recContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  recLeft: {
    flex: 1
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  recOrg: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 8
  },
  recTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f3f4',
    color: '#5f6368',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  emptyText: {
    color: '#5f6368',
    fontStyle: 'italic',
    fontSize: 13
  },
  chatFloatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1a73e8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5
  },
  chatSparkleIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f9ab00',
    borderRadius: 8,
    padding: 2
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124'
  },
  challengeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  challengeModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%'
  },
  challengeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dadce0',
    paddingBottom: 8
  },
  challengeModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124'
  },
  challengeScroll: {
    marginBottom: 20
  },
  challengeSubject: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a73e8',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  challengeQuestionText: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 20
  },
  challengeOption: {
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12
  },
  challengeOptionSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#f8fafd'
  },
  challengeOptionCorrect: {
    borderColor: '#34a853',
    backgroundColor: '#e6f4ea'
  },
  challengeOptionIncorrect: {
    borderColor: '#ea4335',
    backgroundColor: '#fce8e6'
  },
  challengeOptionText: {
    fontSize: 14,
    color: '#3c4043',
    fontWeight: '500'
  },
  challengeExplanationContainer: {
    backgroundColor: '#f1f3f4',
    padding: 14,
    borderRadius: 8,
    marginTop: 16
  },
  challengeExplanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  challengeExplanationText: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20
  },
  challengeModalSubmitBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8
  },
  challengeModalCloseBtn: {
    borderColor: '#1a73e8',
    borderRadius: 8
  }
});
