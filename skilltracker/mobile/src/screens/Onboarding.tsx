import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { Rocket, ShieldAlert, Navigation } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Build Your Career',
    description: 'Discover the skills, knowledge and opportunities you need to reach your career goals.',
    icon: Rocket,
    color: '#e8f0fe'
  },
  {
    title: 'Prepare Smarter',
    description: 'Practice coding, aptitude, government exams, interviews and other career-focused tests.',
    icon: ShieldAlert,
    color: '#fef7e0'
  },
  {
    title: 'Discover Opportunities',
    description: 'Find jobs, internships, scholarships, government opportunities and higher-study options in one place.',
    icon: Navigation,
    color: '#e6f4ea'
  }
];

const Onboarding = ({ navigation }: any) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const SlideIcon = slides[currentSlideIndex].icon;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Career<Text style={styles.logoHighlight}>Verse</Text></Text>
        <Text style={styles.tagline}>One Platform. Every Opportunity. Your Future.</Text>
      </View>

      {/* Main Slide Carousel Container */}
      <View style={styles.slideContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: slides[currentSlideIndex].color }]}>
          <SlideIcon size={64} color="#1a73e8" />
        </View>
        <Text style={styles.slideTitle}>{slides[currentSlideIndex].title}</Text>
        <Text style={styles.slideDescription}>{slides[currentSlideIndex].description}</Text>
      </View>

      {/* Footer controls */}
      <View style={styles.footer}>
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index ? styles.activeIndicator : null
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentSlideIndex < slides.length - 1 ? (
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}

          <Button mode="contained" onPress={handleNext} style={styles.nextButton} contentStyle={{ height: 48 }}>
            {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#202124',
    letterSpacing: -0.5
  },
  logoHighlight: {
    color: '#1a73e8'
  },
  tagline: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 8,
    fontWeight: '500'
  },
  slideContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginVertical: 20
  },
  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 16
  },
  slideDescription: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 24
  },
  footer: {
    paddingHorizontal: 30,
    marginBottom: 20
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#dadce0',
    marginHorizontal: 4
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#1a73e8'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  skipBtn: {
    padding: 10
  },
  skipText: {
    color: '#5f6368',
    fontSize: 16,
    fontWeight: '600'
  },
  nextButton: {
    borderRadius: 24,
    backgroundColor: '#1a73e8',
    minWidth: 120
  }
});
