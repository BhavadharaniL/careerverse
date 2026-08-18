import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Avatar, Card, Button, SegmentedButtons, Switch, List } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import ResumeBuilder from '../components/ResumeBuilder';
import StudyPlanner from '../components/StudyPlanner';
import { Award, ShieldCheck, Flame, Layers, FileText, Settings, User, LogOut } from 'lucide-react-native';

const Profile = () => {
  const { user, logout, reloadProfile } = useAuth();
  const [profileTab, setProfileTab] = useState('portfolio');

  // Settings Toggles
  const [jobDeadlines, setJobDeadlines] = useState(user?.notificationPreferences?.jobDeadlines ?? true);
  const [examRegs, setExamRegs] = useState(user?.notificationPreferences?.examRegistrations ?? true);
  const [challenges, setChallenges] = useState(user?.notificationPreferences?.dailyChallenges ?? true);

  const handleToggleSettings = () => {
    // Save locally for demo
    alert('Notification settings updated!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Upper profile header card */}
      <View style={styles.profileHeader}>
        <Avatar.Text size={60} label={user?.name.substring(0, 2).toUpperCase() || 'CV'} style={styles.avatar} />
        <View style={styles.profileHeaderTexts}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileCollege}>{user?.education.college || 'CareerVerse Student'}</Text>
          <Text style={styles.profileDegree}>{user?.education.degree} in {user?.education.department}</Text>
        </View>
      </View>

      {/* Segmented Controller */}
      <View style={styles.segmentedButtonsContainer}>
        <SegmentedButtons
          value={profileTab}
          onValueChange={setProfileTab}
          buttons={[
            { value: 'portfolio', label: 'Portfolio', icon: 'account-box' },
            { value: 'resume', label: 'Resume', icon: 'file-document' },
            { value: 'study', label: 'Study Plan', icon: 'calendar-clock' },
            { value: 'settings', label: 'Settings', icon: 'cog' }
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* PORTFOLIO TAB */}
      {profileTab === 'portfolio' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Flame size={20} color="#ea4335" />
              <Text style={styles.metricVal}>{user?.streak || 1} Days</Text>
              <Text style={styles.metricLabel}>Streak</Text>
            </View>
            <View style={styles.metricCard}>
              <Award size={20} color="#f9ab00" />
              <Text style={styles.metricVal}>{user?.xp || 10} XP</Text>
              <Text style={styles.metricLabel}>Total Score</Text>
            </View>
            <View style={styles.metricCard}>
              <Layers size={20} color="#1a73e8" />
              <Text style={styles.metricVal}>{user?.skills.length || 0}</Text>
              <Text style={styles.metricLabel}>Skills</Text>
            </View>
          </View>

          {/* Gamification Achievements / Badges */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>🏆 Earned Achievements</Text>
            <View style={styles.badgeGrid}>
              {user?.badges && user.badges.length > 0 ? (
                user.badges.map((badge, i) => (
                  <View key={i} style={styles.badgeItem}>
                    <View style={styles.badgeIconWrapper}>
                      <ShieldCheck size={28} color="#1e8e3e" />
                    </View>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Complete tasks, build resumes, or take mock tests to earn badges!</Text>
              )}
            </View>
          </View>

          {/* Core Goals summary list */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>🎯 Target Career Goals</Text>
            {user?.goals && user.goals.length > 0 ? (
              user.goals.map((g, i) => (
                <Card key={i} style={styles.goalCard}>
                  <Card.Content style={styles.goalCardContent}>
                    <Text style={styles.goalCardText}>{g}</Text>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.emptyText}>No goals selected yet.</Text>
            )}
          </View>

          {/* Tracked Applications Count */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>💼 Applications Tracker ({user?.applicationsTracked.length || 0})</Text>
            {user?.applicationsTracked && user.applicationsTracked.length > 0 ? (
              user.applicationsTracked.map((app, i) => (
                <Card key={i} style={styles.appTrackCard}>
                  <Card.Content style={styles.appTrackContent}>
                    <View>
                      <Text style={styles.appTrackTitle}>{app.title}</Text>
                      <Text style={styles.appTrackOrg}>{app.organization}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{app.status}</Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={styles.emptyText}>No applications tracked yet. Update statuses inside the Opportunities tab.</Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* RESUME BUILDER TAB */}
      {profileTab === 'resume' && (
        <View style={{ flex: 1 }}>
          <ResumeBuilder />
        </View>
      )}

      {/* STUDY PLANNER TAB */}
      {profileTab === 'study' && (
        <View style={{ flex: 1 }}>
          <StudyPlanner />
        </View>
      )}

      {/* SETTINGS TAB */}
      {profileTab === 'settings' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}>Preference Configurations</Text>
          
          <List.Item
            title="Job Deadlines Notifications"
            description="FCM alerts for closing deadlines"
            right={() => <Switch value={jobDeadlines} onValueChange={(v) => { setJobDeadlines(v); handleToggleSettings(); }} color="#1a73e8" />}
          />
          <List.Item
            title="Exam Registrations Alerts"
            description="Alert when recruitment boards release admit cards"
            right={() => <Switch value={examRegs} onValueChange={(v) => { setExamRegs(v); handleToggleSettings(); }} color="#1a73e8" />}
          />
          <List.Item
            title="Daily Challenge Reminders"
            description="Alerts to maintain streak counts"
            right={() => <Switch value={challenges} onValueChange={(v) => { setChallenges(v); handleToggleSettings(); }} color="#1a73e8" />}
          />

          <View style={styles.settingsFooter}>
            <Button
              mode="contained"
              onPress={() => logout()}
              style={styles.logoutBtn}
              icon={() => <LogOut size={18} color="#ffffff" />}
            >
              Sign Out Account
            </Button>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  avatar: {
    backgroundColor: '#1a73e8'
  },
  profileHeaderTexts: {
    marginLeft: 16,
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124'
  },
  profileCollege: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2
  },
  profileDegree: {
    fontSize: 11,
    color: '#5f6368',
    marginTop: 2
  },
  segmentedButtonsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  segmentedButtons: {
    borderRadius: 8
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginTop: 8,
    marginBottom: 2
  },
  metricLabel: {
    fontSize: 10,
    color: '#5f6368'
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dadce0',
    paddingBottom: 6
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  badgeItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  badgeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f4ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4
  },
  badgeDesc: {
    fontSize: 10,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 14
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8
  },
  goalCardContent: {
    paddingVertical: 12
  },
  goalCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3c4043'
  },
  appTrackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8
  },
  appTrackContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  appTrackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202124'
  },
  appTrackOrg: {
    fontSize: 11,
    color: '#5f6368',
    marginTop: 2
  },
  statusBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a73e8'
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#5f6368',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8
  },
  settingsFooter: {
    marginTop: 40,
    paddingHorizontal: 16
  },
  logoutBtn: {
    backgroundColor: '#ea4335',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center'
  }
});
