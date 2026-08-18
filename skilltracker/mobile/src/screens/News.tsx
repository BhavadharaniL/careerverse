import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import { Card, SegmentedButtons, IconButton, Button } from 'react-native-paper';
import { coreAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Share2, Compass, ExternalLink } from 'lucide-react-native';

const NewsCategories = [
  { value: 'All', label: 'All' },
  { value: 'Technology', label: 'Tech' },
  { value: 'Placement', label: 'Placement' },
  { value: 'Government', label: 'Gov' },
  { value: 'Exams', label: 'Exams' },
  { value: 'Scholarships', label: 'Scholarships' },
  { value: 'Internships', label: 'Internships' }
];

const News = () => {
  const { user } = useAuth();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Bookmarks tracked locally in state for demo
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await coreAPI.getNews(activeCategory === 'All' ? undefined : activeCategory);
      setNewsList(response.data);
    } catch (e: any) {
      console.error('Error fetching news:', e);
      setErrorMsg(e.response?.data?.message || e.message || 'Failed to fetch news feed data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
      alert('Removed article from bookmarks.');
    } else {
      setBookmarks([...bookmarks, id]);
      alert('Article saved in bookmarks! 🔖');
    }
  };

  const handleShare = (title: string) => {
    alert(`Sharing news: "${title}"`);
  };

  const handleReadMore = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => alert('Could not open full article URL.'));
    } else {
      alert('Full text is only available inside official subscriber portals.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Career News Feed</Text>

      {/* Horizontal news categories list */}
      <View style={styles.segmentContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {NewsCategories.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setActiveCategory(c.value)}
              style={[
                styles.categoryChip,
                activeCategory === c.value ? styles.categoryChipActive : null
              ]}
            >
              <Text style={[styles.chipText, activeCategory === c.value ? styles.chipTextActive : null]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* News Feed scroll list */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 40 }} />
        ) : errorMsg ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#d93025', fontWeight: 'bold', fontSize: 15, marginBottom: 8 }}>API Connection Issue</Text>
            <Text style={{ color: '#5f6368', textAlign: 'center', marginBottom: 16, paddingHorizontal: 20 }}>{errorMsg}</Text>
            <TouchableOpacity onPress={fetchNews} style={{ backgroundColor: '#1a73e8', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>Retry News Feed</Text>
            </TouchableOpacity>
          </View>
        ) : newsList.length > 0 ? (
          newsList.map((item) => {
            const isBookmarked = bookmarks.includes(item._id);
            return (
              <Card key={item._id} style={styles.card}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                ) : null}
                
                <Card.Content style={styles.cardBody}>
                  <View style={styles.categoryRow}>
                    <Text style={styles.newsCategory}>{item.category.toUpperCase()}</Text>
                    <Text style={styles.publishedAt}>
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.sourceText}>Source: {item.source}</Text>
                    
                    <View style={styles.actionsRow}>
                      <IconButton
                        icon={() => <Bookmark size={18} color={isBookmarked ? '#f9ab00' : '#5f6368'} fill={isBookmarked ? '#f9ab00' : 'transparent'} />}
                        onPress={() => toggleBookmark(item._id)}
                      />
                      <IconButton
                        icon={() => <Share2 size={18} color="#5f6368" />}
                        onPress={() => handleShare(item.title)}
                      />
                      <Button
                        mode="outlined"
                        onPress={() => handleReadMore(item.url)}
                        style={styles.readMoreBtn}
                        labelStyle={styles.readMoreLabel}
                      >
                        Read More
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No news matches your preferences. Try broadening your categories.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff'
  },
  segmentContainer: {
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4'
  },
  horizontalScroll: {
    paddingHorizontal: 16
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#f1f3f4',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  categoryChipActive: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8'
  },
  chipText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '700'
  },
  chipTextActive: {
    color: '#1a73e8'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover'
  },
  cardBody: {
    paddingTop: 12
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  newsCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1a73e8',
    letterSpacing: 0.5
  },
  publishedAt: {
    fontSize: 10,
    color: '#5f6368'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    lineHeight: 22,
    marginBottom: 8
  },
  cardDesc: {
    fontSize: 13,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 16
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 8
  },
  sourceText: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '600'
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  readMoreBtn: {
    borderColor: '#1a73e8',
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    marginLeft: 4
  },
  readMoreLabel: {
    fontSize: 11,
    marginVertical: 0
  },
  emptyText: {
    color: '#5f6368',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20
  }
});
