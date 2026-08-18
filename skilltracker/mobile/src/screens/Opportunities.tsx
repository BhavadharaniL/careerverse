import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, Linking } from 'react-native';
import { Card, TextInput, Button, SegmentedButtons, IconButton } from 'react-native-paper';
import { coreAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, DollarSign, Calendar, Sparkles, Navigation, CheckCircle, ExternalLink } from 'lucide-react-native';

const Opportunities = () => {
  const { reloadProfile } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<'job' | 'government_job' | 'internship' | 'scholarship'>('job');

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  // Details Modal
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [oppLoading, setOppLoading] = useState(false);

  // Eligibility and tracker states
  const [eligibilityData, setEligibilityData] = useState<any>(null);
  const [trackingStatus, setTrackingStatus] = useState<string>('Saved');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [activeType, searchQuery, locationQuery]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const filters = {
        type: activeType,
        search: searchQuery || undefined,
        location: locationQuery || undefined
      };
      const response = await coreAPI.getOpportunities(filters);
      setOpportunities(response.data);
    } catch (e) {
      console.error('Error fetching opportunities:', e);
    } finally {
      setLoading(false);
    }
  };

  const openOppDetails = async (opp: any) => {
    setSelectedOpp(opp);
    setEligibilityData(null);
    setTrackingStatus('Saved');
    setModalVisible(true);
    setOppLoading(true);

    try {
      // Check eligibility
      const eligRes = await coreAPI.checkEligibility(opp._id);
      setEligibilityData(eligRes.data);
    } catch (e) {
      console.error('Error checking eligibility:', e);
    } finally {
      setOppLoading(false);
    }
  };

  const handleTrackApplication = async () => {
    if (!selectedOpp) return;
    setIsTracking(true);
    try {
      await coreAPI.trackApplication(selectedOpp._id, trackingStatus);
      alert(`Successfully updated application status to: ${trackingStatus}!`);
      await reloadProfile();
    } catch (e) {
      alert('Failed to update application tracker status.');
    } finally {
      setIsTracking(false);
    }
  };

  const handleApplyOfficially = () => {
    if (selectedOpp && selectedOpp.officialUrl) {
      Linking.openURL(selectedOpp.officialUrl).catch(err => {
        alert('Could not open the official website URL.');
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.filterHeader}>
        <TextInput
          placeholder="Search jobs, internships, boards..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          dense
          style={styles.input}
          outlineColor="#dadce0"
          activeOutlineColor="#1a73e8"
          left={<TextInput.Icon icon="magnify" iconColor="#5f6368" />}
        />
        <TextInput
          placeholder="Filter by city/location..."
          value={locationQuery}
          onChangeText={setLocationQuery}
          mode="outlined"
          dense
          style={[styles.input, { marginTop: 6 }]}
          outlineColor="#dadce0"
          activeOutlineColor="#1a73e8"
          left={<TextInput.Icon icon="map-marker-outline" iconColor="#5f6368" />}
        />
      </View>

      {/* Segmented Buttons for Category selector */}
      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={activeType}
          onValueChange={(val: any) => setActiveType(val)}
          buttons={[
            { value: 'job', label: 'Private Jobs' },
            { value: 'government_job', label: 'Gov Jobs' },
            { value: 'internship', label: 'Internships' },
            { value: 'scholarship', label: 'Scholarships' }
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Opportunities scroll list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 40 }} />
        ) : opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <Card key={opp._id} style={styles.card} onPress={() => openOppDetails(opp)}>
              <Card.Content>
                <Text style={styles.cardTitle}>{opp.title}</Text>
                <Text style={styles.cardOrg}>{opp.organization}</Text>

                <View style={styles.cardMetaRow}>
                  <View style={styles.cardMetaItem}>
                    <MapPin size={14} color="#5f6368" />
                    <Text style={styles.cardMetaText}> {opp.location}</Text>
                  </View>
                  {opp.salary && (
                    <View style={styles.cardMetaItem}>
                      <DollarSign size={14} color="#5f6368" />
                      <Text style={styles.cardMetaText}> {opp.salary}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.deadlineRow}>
                    <Calendar size={14} color="#5f6368" />
                    <Text style={styles.deadlineText}> Deadline: {new Date(opp.endDate).toLocaleDateString()}</Text>
                  </View>
                  <Button mode="outlined" style={styles.viewDetailsBtn} labelStyle={styles.viewDetailsLabel}>
                    View
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>No matching opportunities found. Try updating your filters.</Text>
        )}
      </ScrollView>

      {/* Details and Actions Modal Overlay */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        {selectedOpp && (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View style={styles.modalHeader}>
              <IconButton icon="close" size={24} onPress={() => setModalVisible(false)} />
              <Text style={styles.modalHeaderTitle} numberOfLines={1}>Opportunity Details</Text>
              <IconButton icon="share-variant-outline" size={24} onPress={() => alert('Link copied to clipboard!')} />
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalTitle}>{selectedOpp.title}</Text>
              <Text style={styles.modalOrg}>{selectedOpp.organization}</Text>

              <View style={styles.modalMetaCard}>
                <View style={styles.modalMetaGrid}>
                  <Text style={styles.metaLabel}>Location:</Text>
                  <Text style={styles.metaValue}>{selectedOpp.location} ({selectedOpp.remoteOrOnsite || 'onsite'})</Text>
                  
                  {selectedOpp.salary && (
                    <>
                      <Text style={styles.metaLabel}>Salary/Stipend:</Text>
                      <Text style={styles.metaValue}>{selectedOpp.salary}</Text>
                    </>
                  )}

                  <Text style={styles.metaLabel}>Qualification:</Text>
                  <Text style={styles.metaValue}>{selectedOpp.qualification}</Text>

                  <Text style={styles.metaLabel}>Last Date to Apply:</Text>
                  <Text style={styles.metaValue}>{new Date(selectedOpp.endDate).toLocaleDateString()}</Text>
                </View>
              </View>

              {/* 1. Smart Eligibility Checker widget */}
              <View style={styles.boxSection}>
                <Text style={styles.sectionHeader}>🔎 Eligibility Assessment</Text>
                {oppLoading ? (
                  <ActivityIndicator size="small" color="#1a73e8" />
                ) : eligibilityData ? (
                  <View style={[styles.eligibilityBanner, eligibilityData.eligible ? styles.eligEligible : styles.eligNotEligible]}>
                    <Text style={[styles.eligibilityText, eligibilityData.eligible ? { color: '#1e8e3e' } : { color: '#d93025' }]}>
                      {eligibilityData.message}
                    </Text>
                    <Text style={styles.eligibilityNote}>Verify eligibility in the official notification before applying.</Text>
                  </View>
                ) : (
                  <Text style={styles.emptyText}>Loading eligibility data...</Text>
                )}
              </View>

              {/* 2. Job details and description */}
              <View style={styles.boxSection}>
                <Text style={styles.sectionHeader}>📋 Description & Requirements</Text>
                <Text style={styles.bodyText}>{selectedOpp.description}</Text>
                
                <Text style={[styles.subHeader, { marginTop: 12 }]}>Minimum Criteria:</Text>
                <Text style={styles.bodyText}>{selectedOpp.eligibility}</Text>

                {selectedOpp.benefits && (
                  <>
                    <Text style={[styles.subHeader, { marginTop: 12 }]}>Benefits & Perks:</Text>
                    <Text style={styles.bodyText}>{selectedOpp.benefits}</Text>
                  </>
                )}
              </View>

              {/* 3. Government Details patterns if government_job */}
              {selectedOpp.type === 'government_job' && (
                <View style={styles.boxSection}>
                  <Text style={styles.sectionHeader}>🏛️ Government Exam Profile</Text>
                  
                  {selectedOpp.vacancies && (
                    <Text style={styles.govText}><Text style={styles.bold}>Vacancies:</Text> {selectedOpp.vacancies}</Text>
                  )}
                  {selectedOpp.ageLimit && (
                    <Text style={styles.govText}><Text style={styles.bold}>Age Limit:</Text> {selectedOpp.ageLimit}</Text>
                  )}
                  {selectedOpp.selectionProcess && (
                    <Text style={styles.govText}><Text style={styles.bold}>Selection Process:</Text> {selectedOpp.selectionProcess}</Text>
                  )}
                  {selectedOpp.examPattern && (
                    <Text style={styles.govText}><Text style={styles.bold}>Exam Pattern:</Text> {selectedOpp.examPattern}</Text>
                  )}
                  {selectedOpp.syllabus && (
                    <Text style={styles.govText}><Text style={styles.bold}>Syllabus Detail:</Text> {selectedOpp.syllabus}</Text>
                  )}
                </View>
              )}

              {/* 4. Registration Guidance steps */}
              <View style={styles.boxSection}>
                <Text style={styles.sectionHeader}>🚀 How to Apply</Text>
                <View style={styles.stepRow}>
                  <Text style={styles.stepNo}>1</Text>
                  <Text style={styles.stepBody}>Click "Apply Officially" to open portal.</Text>
                </View>
                <View style={styles.stepRow}>
                  <Text style={styles.stepNo}>2</Text>
                  <Text style={styles.stepBody}>Create an applicant account and complete details form.</Text>
                </View>
                <View style={styles.stepRow}>
                  <Text style={styles.stepNo}>3</Text>
                  <Text style={styles.stepBody}>Upload mandatory documents (Mark sheets, ID details, Resume).</Text>
                </View>
                <View style={styles.stepRow}>
                  <Text style={styles.stepNo}>4</Text>
                  <Text style={styles.stepBody}>Pay online fees (if applicable) and download acknowledgement code.</Text>
                </View>
                <Text style={styles.applyDisclaimer}>Apply through the official website only. CareerVerse does not charge fees.</Text>
              </View>

              {/* 5. Application status tracker config */}
              <View style={styles.boxSection}>
                <Text style={styles.sectionHeader}>📌 Application Tracker Status</Text>
                <View style={styles.trackerRow}>
                  {['Saved', 'Applied', 'Assessment', 'Interviewing'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      onPress={() => setTrackingStatus(st)}
                      style={[
                        styles.trackerBtn,
                        trackingStatus === st ? styles.trackerBtnActive : null
                      ]}
                    >
                      <Text style={[styles.trackerBtnText, trackingStatus === st ? styles.trackerBtnTextActive : null]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button mode="contained" onPress={handleTrackApplication} loading={isTracking} disabled={isTracking} style={styles.saveTrackerBtn}>
                  Update Track Status
                </Button>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button mode="contained" onPress={handleApplyOfficially} style={styles.applyBtn} icon={() => <ExternalLink size={18} color="#ffffff" />}>
                Apply Officially
              </Button>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default Opportunities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  filterHeader: {
    padding: 16,
    backgroundColor: '#ffffff'
  },
  input: {
    backgroundColor: '#f1f3f4'
  },
  segmentContainer: {
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  cardOrg: {
    fontSize: 13,
    color: '#5f6368',
    marginBottom: 12
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  cardMetaText: {
    fontSize: 12,
    color: '#5f6368'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 12
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deadlineText: {
    fontSize: 11,
    color: '#d93025',
    fontWeight: '500'
  },
  viewDetailsBtn: {
    borderColor: '#1a73e8',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center'
  },
  viewDetailsLabel: {
    fontSize: 12,
    marginVertical: 0
  },
  emptyText: {
    color: '#5f6368',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#ffffff'
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    flex: 1,
    textAlign: 'center'
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 80
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4
  },
  modalOrg: {
    fontSize: 15,
    color: '#5f6368',
    marginBottom: 20
  },
  modalMetaCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20
  },
  modalMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  metaLabel: {
    width: '40%',
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 10,
    fontWeight: '600'
  },
  metaValue: {
    width: '60%',
    fontSize: 12,
    color: '#202124',
    marginBottom: 10,
    fontWeight: '700'
  },
  boxSection: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    paddingBottom: 6
  },
  eligibilityBanner: {
    padding: 12,
    borderRadius: 8
  },
  eligEligible: {
    backgroundColor: '#e6f4ea'
  },
  eligNotEligible: {
    backgroundColor: '#fce8e6'
  },
  eligibilityText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18
  },
  eligibilityNote: {
    fontSize: 10,
    color: '#5f6368',
    marginTop: 6,
    fontStyle: 'italic'
  },
  bodyText: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#202124'
  },
  govText: {
    fontSize: 12,
    color: '#3c4043',
    lineHeight: 18,
    marginBottom: 8
  },
  bold: {
    fontWeight: '700',
    color: '#202124'
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  stepNo: {
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 10
  },
  stepBody: {
    fontSize: 12,
    color: '#3c4043',
    flex: 1,
    lineHeight: 18
  },
  applyDisclaimer: {
    fontSize: 10,
    color: '#ea4335',
    fontStyle: 'italic',
    marginTop: 10,
    fontWeight: '600'
  },
  trackerRow: {
    flexDirection: 'row',
    marginBottom: 16
  },
  trackerBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 2
  },
  trackerBtnActive: {
    borderColor: '#1a73e8',
    backgroundColor: '#f8fafd'
  },
  trackerBtnText: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '600'
  },
  trackerBtnTextActive: {
    color: '#1a73e8'
  },
  saveTrackerBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 8
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    backgroundColor: '#ffffff'
  },
  applyBtn: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center'
  }
});
