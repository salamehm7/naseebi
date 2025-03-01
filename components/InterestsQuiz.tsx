import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import { Coffee, Book, Mountain, Users, Home, Heart, MessageSquare, Star, Brain, Leaf } from 'lucide-react-native';

interface InterestsQuizProps {
  onComplete: (results: Record<string, string[]>) => void;
}

const InterestsQuiz: React.FC<InterestsQuizProps> = ({ onComplete }) => {
  // Store all answers in one place - now with arrays for multiple selections
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Define all questions and options
  const questions = [
    {
      id: 'weekend',
      text: "What's your ideal weekend?",
      options: [
        { 
          id: 'outdoors', 
          text: 'Outdoor Adventure', 
          description: 'Hiking, camping, or exploring nature',
          icon: <Mountain size={24} color={Colors.primary} /> 
        },
        { 
          id: 'social', 
          text: 'Social Gatherings', 
          description: 'Spending time with friends and family',
          icon: <Users size={24} color={Colors.primary} /> 
        },
        { 
          id: 'relaxing', 
          text: 'Relaxing at Home', 
          description: 'Quiet time reading or watching movies',
          icon: <Home size={24} color={Colors.primary} /> 
        },
        { 
          id: 'cultural', 
          text: 'Cultural Activities', 
          description: 'Museums, art galleries, or concerts',
          icon: <Book size={24} color={Colors.primary} /> 
        }
      ]
    },
    {
      id: 'marriageApproach',
      text: "How do you view marriage?",
      options: [
        { 
          id: 'growth', 
          text: 'Growing Together', 
          description: 'Evolving and developing as a team',
          icon: <Leaf size={24} color={Colors.primary} /> 
        },
        { 
          id: 'partnership', 
          text: 'Equal Partnership', 
          description: 'Sharing responsibilities equally',
          icon: <Users size={24} color={Colors.primary} /> 
        },
        { 
          id: 'traditional', 
          text: 'Traditional Values', 
          description: 'Following established roles and customs',
          icon: <Home size={24} color={Colors.primary} /> 
        },
        { 
          id: 'spiritual', 
          text: 'Spiritual Journey', 
          description: 'Growing in faith and religious practice together',
          icon: <Star size={24} color={Colors.primary} /> 
        }
      ]
    },
    {
      id: 'communication',
      text: "How do you prefer to communicate?",
      options: [
        { 
          id: 'deepTalks', 
          text: 'Deep Conversations', 
          description: 'Meaningful discussions about important topics',
          icon: <MessageSquare size={24} color={Colors.primary} /> 
        },
        { 
          id: 'actions', 
          text: 'Actions over Words', 
          description: 'Showing care through helpful deeds',
          icon: <Coffee size={24} color={Colors.primary} /> 
        },
        { 
          id: 'humor', 
          text: 'With Humor', 
          description: 'Using jokes and laughter to connect',
          icon: <Coffee size={24} color={Colors.primary} /> 
        },
        { 
          id: 'direct', 
          text: 'Direct & Honest', 
          description: 'Clear and straightforward communication',
          icon: <Coffee size={24} color={Colors.primary} /> 
        }
      ]
    },
    {
      id: 'partnerQualities',
      text: "What qualities do you value most in a partner?",
      options: [
        { 
          id: 'kindness', 
          text: 'Kindness', 
          description: 'Compassionate and caring toward others',
          icon: <Heart size={24} color={Colors.primary} /> 
        },
        { 
          id: 'ambition', 
          text: 'Ambition', 
          description: 'Driven to achieve goals and grow',
          icon: <Leaf size={24} color={Colors.primary} /> 
        },
        { 
          id: 'intelligence', 
          text: 'Intelligence', 
          description: 'Thoughtful and intellectually curious',
          icon: <Brain size={24} color={Colors.primary} /> 
        },
        { 
          id: 'faith', 
          text: 'Strong Faith', 
          description: 'Dedicated to religious practice and values',
          icon: <Star size={24} color={Colors.primary} /> 
        }
      ]
    }
  ];
  
  // Toggle an answer selection
  const toggleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => {
      const currentSelections = prev[questionId] || [];
      
      // If already selected, remove it
      if (currentSelections.includes(answerId)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter(id => id !== answerId)
        };
      }
      
      // If not selected and we have fewer than 2 selections, add it
      if (currentSelections.length < 2) {
        return {
          ...prev,
          [questionId]: [...currentSelections, answerId]
        };
      }
      
      // Otherwise, replace the oldest selection
      return {
        ...prev,
        [questionId]: [currentSelections[1], answerId]
      };
    });
  };
  
  // Check if we can move to the next question
  const canAdvance = () => {
    const currentSelections = answers[questions[currentQuestionIndex].id] || [];
    return currentSelections.length > 0;
  };
  
  // Move to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (canAdvance()) {
      onComplete(answers);
    }
  };
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Progress indicator
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      {/* Question indicator */}
      <Text style={styles.questionCounter}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Text>
      
      {/* Question */}
      <Text style={styles.questionText}>{currentQuestion.text}</Text>
      <Text style={styles.selectionHint}>Select up to 2 options</Text>
      
      {/* Options */}
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {currentQuestion.options.map(option => {
          const isSelected = (answers[currentQuestion.id] || []).includes(option.id);
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected && styles.selectedOption
              ]}
              onPress={() => toggleAnswer(currentQuestion.id, option.id)}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  {option.icon}
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText
                  ]}>
                    {option.text}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Navigation buttons */}
      <View style={styles.navigationButtons}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.navButton, 
            styles.primaryButton,
            !canAdvance() && styles.disabledButton
          ]}
          onPress={goToNextQuestion}
          disabled={!canAdvance()}
        >
          <Text style={[
            styles.primaryButtonText,
            !canAdvance() && styles.disabledButtonText
          ]}>
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    marginBottom: 16,
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  questionCounter: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectionHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  selectedOption: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
  },
  navButtonText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButtonText: {
    color: Colors.textSecondary,
  }
});

export default InterestsQuiz;