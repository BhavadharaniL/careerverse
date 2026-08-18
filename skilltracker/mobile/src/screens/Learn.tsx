import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, TextInput, Button, SegmentedButtons, IconButton, ProgressBar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { coreAPI } from '../services/api';
import { BookOpen, Award, Plus, Trash2, ArrowRight, Sparkles, CheckSquare, Square } from 'lucide-react-native';

const Learn = () => {
  const { user, updateSkills, reloadProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('roadmaps');
  const [loading, setLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Roadmaps States
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  
  // 2. Skill Tracker States
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newSkillHours, setNewSkillHours] = useState('');

  // 3. Skill Gap States
  const [targetRole, setTargetRole] = useState('');
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await coreAPI.getRoadmaps();
      setRoadmaps(response.data);
    } catch (e) {
      console.error('Error fetching roadmaps:', e);
    }
  };

  const loadRoadmapDetails = async (career: string) => {
    setLoading(true);
    try {
      const response = await coreAPI.getRoadmaps(career);
      setSelectedRoadmap(response.data);
    } catch (e) {
      console.error('Error loading roadmap details:', e);
    } finally {
      setLoading(false);
    }
  };

  // Skill Tracker Methods
  const handleAddSkill = async () => {
    if (!newSkillName.trim()) {
      alert('Please enter a skill name.');
      return;
    }
    
    const percentageMap = { 'Beginner': 30, 'Intermediate': 60, 'Advanced': 90 };
    const newSkill = {
      name: newSkillName.trim(),
      proficiency: newSkillLevel,
      percentage: percentageMap[newSkillLevel],
      learningHours: Number(newSkillHours) || 0
    };

    const currentSkills = user?.skills || [];
    const updatedSkills = [...currentSkills, newSkill];

    try {
      setLoading(true);
      await updateSkills(updatedSkills);
      setNewSkillName('');
      setNewSkillHours('');
      alert('Skill added successfully! +20 XP awarded 🌟');
    } catch (e) {
      alert('Failed to save skill.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    const currentSkills = user?.skills || [];
    const updatedSkills = currentSkills.filter(s => s.name !== skillName);
    
    try {
      setLoading(true);
      await updateSkills(updatedSkills);
    } catch (e) {
      alert('Failed to delete skill.');
    } finally {
      setLoading(false);
    }
  };

  // Skill Gap Methods
  const runGapAnalysis = async () => {
    if (!targetRole.trim()) {
      alert('Please enter a target career role.');
      return;
    }
    setLoading(true);
    try {
      const response = await coreAPI.analyzeSkillGap(targetRole);
      setGapAnalysis(response.data);
    } catch (e) {
      alert('Failed to analyze skill gaps.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search skills, roadmaps, certifications..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          dense
          style={styles.searchBar}
          outlineColor="#dadce0"
          activeOutlineColor="#1a73e8"
          left={<TextInput.Icon icon="magnify" iconColor="#5f6368" />}
        />
      </View>

      {/* Segmented Buttons for Sub-Tabs */}
      <View style={styles.segmentedButtonsContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'roadmaps', label: 'Roadmaps', icon: 'map-marker-path' },
            { value: 'skills', label: 'Skills Tracker', icon: 'code-tags' },
            { value: 'gap', label: 'Skill Gap AI', icon: 'compass-outline' }
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1a73e8" />
          </View>
        )}

        {/* TAB 1: CAREER ROADMAPS */}
        {activeTab === 'roadmaps' && !loading && (
          <View>
            {!selectedRoadmap ? (
              <View>
                <Text style={styles.tabHeading}>Select a Career Goal Path</Text>
                {roadmaps.map((r: any) => (
                  <Card key={r._id} style={styles.roadmapCard} onPress={() => loadRoadmapDetails(r.targetCareer)}>
                    <Card.Content style={styles.roadmapCardContent}>
                      <View style={styles.roadmapCardLeft}>
                        <BookOpen size={24} color="#1a73e8" />
                        <Text style={styles.roadmapCardTitle}>{r.targetCareer} Roadmap</Text>
                      </View>
                      <ArrowRight size={20} color="#5f6368" />
                    </Card.Content>
                  </Card>
                ))}
              </View>
            ) : (
              <View>
                {/* Detailed Interactive Roadmap steps visualization */}
                <TouchableOpacity onPress={() => setSelectedRoadmap(null)} style={styles.backLink}>
                  <Text style={styles.backLinkText}>← Back to list</Text>
                </TouchableOpacity>

                <View style={styles.roadmapDetailsHeader}>
                  <Text style={styles.detailsHeading}>{selectedRoadmap.targetCareer} Roadmap</Text>
                  <Text style={styles.detailsSub}>Complete each stage and solve practice tests.</Text>
                </View>

                {selectedRoadmap.steps.map((step: any, idx: number) => (
                  <Card key={idx} style={styles.stepCard}>
                    <Card.Content>
                      <View style={styles.stepHeaderRow}>
                        <Text style={styles.stepHeaderTitle}>{step.title}</Text>
                        {/* Completion state visual */}
                        <IconButton icon="check-circle-outline" iconColor="#dadce0" size={20} />
                      </View>
                      <Text style={styles.stepDesc}>{step.description}</Text>
                      
                      <Text style={styles.resourceHeader}>🔗 Learning Resources:</Text>
                      {step.resources.map((res: any, i: number) => (
                        <TouchableOpacity key={i} style={styles.resourceItem} onPress={() => alert(`Opening resource: ${res.url}`)}>
                          <Text style={styles.resourceText}>{res.title} ({res.type})</Text>
                        </TouchableOpacity>
                      ))}

                      {step.practiceTestId && (
                        <Button mode="contained" onPress={() => alert('Starting step assessment test!')} style={styles.stepTestBtn}>
                          Practice Test
                        </Button>
                      )}
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 2: SKILL TRACKER */}
        {activeTab === 'skills' && !loading && (
          <View>
            <Card style={styles.addSkillCard}>
              <Card.Content>
                <Text style={styles.cardHeader}>Add New Skill to Tracker</Text>
                
                <TextInput
                  label="Skill Name (e.g. Python, Docker)"
                  value={newSkillName}
                  onChangeText={setNewSkillName}
                  mode="outlined"
                  style={styles.input}
                />

                <TextInput
                  label="Learning Hours Dedicated"
                  value={newSkillHours}
                  onChangeText={setNewSkillHours}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                />

                {/* Simple Level Selection row */}
                <Text style={styles.fieldLabel}>Proficiency Level:</Text>
                <View style={styles.levelRow}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setNewSkillLevel(level as any)}
                      style={[
                        styles.levelBtn,
                        newSkillLevel === level ? styles.levelBtnActive : null
                      ]}
                    >
                      <Text style={[styles.levelBtnText, newSkillLevel === level ? styles.levelBtnTextActive : null]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button mode="contained" onPress={handleAddSkill} style={styles.addSkillSubmitBtn} icon={() => <Plus size={20} color="#ffffff" />}>
                  Track Skill
                </Button>
              </Card.Content>
            </Card>

            <View style={styles.skillsListContainer}>
              <Text style={styles.tabHeading}>My Active Skills ({user?.skills.length || 0})</Text>
              
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill, i) => (
                  <Card key={i} style={styles.skillRowCard}>
                    <Card.Content style={styles.skillRowContent}>
                      <View style={styles.skillRowLeft}>
                        <Text style={styles.skillRowName}>{skill.name}</Text>
                        <Text style={styles.skillRowMeta}>{skill.proficiency} • {skill.learningHours || 0} hrs study</Text>
                        <ProgressBar progress={skill.percentage / 100} color="#1a73e8" style={styles.skillProgressBar} />
                      </View>
                      <View style={styles.skillRowRight}>
                        <Text style={styles.skillRowPercentage}>{skill.percentage}%</Text>
                        <IconButton icon={() => <Trash2 size={18} color="#d93025" />} onPress={() => handleDeleteSkill(skill.name)} />
                      </View>
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <Text style={styles.emptyText}>No skills tracked yet. Setup your profile skills to start.</Text>
              )}
            </View>
          </View>
        )}

        {/* TAB 3: SKILL GAP ANALYSIS */}
        {activeTab === 'gap' && !loading && (
          <View>
            <Card style={styles.gapCard}>
              <Card.Content>
                <Text style={styles.cardHeader}>AI Skill Gap Analyzer</Text>
                <Text style={styles.formSub}>Input your target career role, and CareerVerse AI will identify missing competencies.</Text>

                <TextInput
                  label="Target Career Role (e.g. AI Engineer, Data Scientist)"
                  value={targetRole}
                  onChangeText={setTargetRole}
                  mode="outlined"
                  style={styles.input}
                  placeholder="Enter dream role..."
                />

                <Button mode="contained" onPress={runGapAnalysis} style={styles.gapSubmitBtn} icon={() => <Sparkles size={20} color="#ffffff" />}>
                  Analyze Career Gap
                </Button>
              </Card.Content>
            </Card>

            {gapAnalysis && (
              <Card style={styles.analysisResultCard}>
                <Card.Content>
                  <View style={styles.resultHeader}>
                    <Sparkles size={24} color="#f9ab00" />
                    <Text style={styles.resultHeaderTitle}>AI Analysis Results</Text>
                  </View>

                  <View style={styles.readinessScoreRow}>
                    <Text style={styles.readinessLabel}>Estimated Career Readiness:</Text>
                    <Text style={styles.readinessVal}>{gapAnalysis.readinessPercentage}%</Text>
                  </View>
                  <ProgressBar progress={gapAnalysis.readinessPercentage / 100} color="#f9ab00" style={styles.analysisProgressBar} />

                  <Text style={styles.critiqueTitle}>AI Critique Advice:</Text>
                  <Text style={styles.critiqueText}>{gapAnalysis.explanation}</Text>

                  <Text style={styles.missingHeader}>❌ Missing Skills Identified ({gapAnalysis.gapCount}):</Text>
                  {gapAnalysis.missingSkills.map((skill: string, i: number) => (
                    <Text key={i} style={styles.missingItem}>• {skill}</Text>
                  ))}

                  <Button mode="contained" onPress={() => loadRoadmapDetails(targetRole)} style={styles.generateRoadmapBtn}>
                    Generate Recommended Roadmap
                  </Button>
                </Card.Content>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Learn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  searchBarContainer: {
    padding: 16,
    backgroundColor: '#ffffff'
  },
  searchBar: {
    backgroundColor: '#f1f3f4'
  },
  segmentedButtonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  loader: {
    marginVertical: 40
  },
  tabHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 16,
    marginTop: 8
  },
  roadmapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  roadmapCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  roadmapCardLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roadmapCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
    marginLeft: 16
  },
  backLink: {
    marginBottom: 16
  },
  backLinkText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600'
  },
  roadmapDetailsHeader: {
    marginBottom: 20
  },
  detailsHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  detailsSub: {
    fontSize: 13,
    color: '#5f6368'
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124'
  },
  stepDesc: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20,
    marginVertical: 12
  },
  resourceHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  resourceItem: {
    backgroundColor: '#f1f3f4',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6
  },
  resourceText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500'
  },
  stepTestBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    marginTop: 12
  },
  addSkillCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 16
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#ffffff'
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8
  },
  levelRow: {
    flexDirection: 'row',
    marginBottom: 20
  },
  levelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#dadce0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4
  },
  levelBtnActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#f8fafd'
  },
  levelBtnText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '700'
  },
  levelBtnTextActive: {
    color: '#1a73e8'
  },
  addSkillSubmitBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center'
  },
  skillsListContainer: {
    marginBottom: 20
  },
  skillRowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8
  },
  skillRowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4
  },
  skillRowLeft: {
    flex: 1,
    marginRight: 10
  },
  skillRowName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124'
  },
  skillRowMeta: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2,
    marginBottom: 8
  },
  skillProgressBar: {
    height: 6,
    borderRadius: 3
  },
  skillRowRight: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  skillRowPercentage: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1a73e8',
    marginBottom: 2
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#5f6368',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20
  },
  gapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20
  },
  formSub: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 18,
    marginBottom: 16
  },
  gapSubmitBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center'
  },
  analysisResultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  resultHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginLeft: 12
  },
  readinessScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  readinessLabel: {
    fontSize: 13,
    color: '#5f6368'
  },
  readinessVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f9ab00'
  },
  analysisProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20
  },
  critiqueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 6
  },
  critiqueText: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 20
  },
  missingHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8
  },
  missingItem: {
    fontSize: 13,
    color: '#d93025',
    lineHeight: 18,
    marginLeft: 8,
    marginBottom: 4
  },
  generateRoadmapBtn: {
    backgroundColor: '#f9ab00',
    borderRadius: 8,
    marginTop: 20
  }
});
