import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// 화면 import
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthChoiceScreen from '../screens/Auth/AuthChoiceScreen';
import EmailSignUpScreen from '../screens/Auth/EmailSignUpScreen';
import EmailLoginScreen from '../screens/Auth/EmailLoginScreen';
import HomeScreen from '../screens/HomeScreen';

// 하단 탭 화면들
import FeaturesScreen from '../screens/FeaturesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// 추가 화면들
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import InfoScreen from '../screens/InfoScreen';
import PremiumScreen from '../screens/PremiumScreen';
import PurposeSelectionScreen from '../screens/PurposeSelectionScreen';
import AnalysisGraphScreen from '../screens/AnalysisGraphScreen';

// Obooni 관련 화면들
import ObooniCustomizationScreen from '../screens/Obooni/ObooniCustomizationScreen';
import ObooniClosetScreen from '../screens/Obooni/ObooniClosetScreen';
import ObooniShopScreen from '../screens/Obooni/ObooniShopScreen';
import ObooniOwnedItemsScreen from '../screens/Obooni/ObooniOwnedItemsScreen';

// Album 관련 화면들
import GrowthAlbumScreen from '../screens/Album/GrowthAlbumScreen';
import GrowthAlbumCalendarView from '../screens/Album/GrowthAlbumCalendarView';
import GrowthAlbumCategoryView from '../screens/Album/GrowthAlbumCategoryView';
import PhotoUploadModal from '../screens/Album/PhotoUploadModal';

// Pomodoro 관련 화면들
import PomodoroScreen from '../screens/Pomodoro/PomodoroScreen';
import PomodoroTimerScreen from '../screens/Pomodoro/PomodoroTimerScreen';
import PomodoroGoalSelectionScreen from '../screens/Pomodoro/PomodoroGoalSelectionScreen';
import PomodoroGoalCreationScreen from '../screens/Pomodoro/PomodoroGoalCreationScreen';
import PomodoroBreakChoiceScreen from '../screens/Pomodoro/PomodoroBreakChoiceScreen';
import PomodoroPauseScreen from '../screens/Pomodoro/PomodoroPauseScreen';
import PomodoroStopScreen from '../screens/Pomodoro/PomodoroStopScreen';
import PomodoroFinishScreen from '../screens/Pomodoro/PomodoroFinishScreen';
import PomodoroCycleCompleteScreen from '../screens/Pomodoro/PomodoroCycleCompleteScreen';
import PomodoroResetConfirmModal from '../screens/Pomodoro/PomodoroResetConfirmModal';

// TimeAttack 관련 화면들
import TimeAttackScreen from '../screens/TimeAttack/TimeAttackScreen';
import TimeAttackGoalSettingScreen from '../screens/TimeAttack/TimeAttackGoalSettingScreen';
import TimeAttackAISubdivisionScreen from '../screens/TimeAttack/TimeAttackAISubdivisionScreen';
import TimeAttackInProgressScreen from '../screens/TimeAttack/TimeAttackInProgressScreen';
import TimeAttackCompleteScreen from '../screens/TimeAttack/TimeAttackCompleteScreen';
import TimeAttackStopScreen from '../screens/TimeAttack/TimeAttackStopScreen';

// Task 관련 화면들
import TaskCalendarScreen from '../screens/Task/TaskCalendarScreen';
import TaskDetailModal from '../screens/Task/TaskDetailModal';
import TaskEditModal from '../screens/Task/TaskEditModal';
import TaskDeleteConfirmModal from '../screens/Task/TaskDeleteConfirmModal';
import TaskCompleteCoinModal from '../screens/Task/TaskCompleteCoinModal';
import CategorySettingModal from '../screens/Task/CategorySettingModal';
import CategoryEditModal from '../screens/Task/CategoryEditModal';


// Reminder 관련 화면들
import ReminderScreen from '../screens/Reminder/ReminderScreen';
import ReminderAddEditScreen from '../screens/Reminder/ReminderAddEditScreen';
import ReminderChecklistScreen from '../screens/Reminder/ReminderChecklistScreen';
import ReminderLocationSettingScreen from '../screens/Reminder/ReminderLocationSettingScreen';
import ReminderTimeSettingModal from '../screens/Reminder/ReminderTimeSettingModal';
import ReminderLocationAlertModal from '../screens/Reminder/ReminderLocationAlertModal';
import ReminderCompleteCoinModal from '../screens/Reminder/ReminderCompleteCoinModal';

// Analysis 관련 화면들
import DailyAnalysisView from '../screens/Analysis/DailyAnalysisView';
import WeeklyAnalysisView from '../screens/Analysis/WeeklyAnalysisView';
import MonthlyAnalysisView from '../screens/Analysis/MonthlyAnalysisView';
import DDayAnalysisView from '../screens/Analysis/DDayAnalysisView';

// Goal 관련 화면들
import GoalDetailScreen from '../screens/GoalDetailScreen';
import GoalDetailScreenV2 from '../screens/GoalDetailScreenV2';
import GoalScheduleGenerationScreen from '../screens/GoalScheduleGenerationScreen';
import GoalScheduleEditScreen from '../screens/GoalScheduleEditScreen';
import GoalRecommendationScreen from '../screens/GoalRecommendationScreen';

// Routine 관련 화면들
import RoutineSettingScreen from '../screens/RoutineSettingScreen';
import RoutineLoadingScreen from '../screens/RoutineLoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 하단 탭 네비게이터 컴포넌트
const MainTabNavigator = ({ route }) => {
  const { isPremiumUser } = route.params || { isPremiumUser: false };
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'user'; // 사람 아이콘
          } else if (route.name === 'Task') {
            iconName = 'image'; // 사각형+물결 아이콘 (갤러리/이미지)
          } else if (route.name === 'Features') {
            iconName = 'bars'; // 3줄 아이콘
          } else if (route.name === 'Settings') {
            iconName = 'cog'; // 기어 아이콘
          }

          return <FontAwesome5 name={iconName} size={size} color={color} solid={false} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ isPremiumUser }}
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen 
        name="Task" 
        component={TaskCalendarScreen} 
        options={{ tabBarLabel: '작업' }}
      />
      <Tab.Screen 
        name="Features" 
        component={FeaturesScreen} 
        options={{ tabBarLabel: '기능' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: '설정' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ initialRoute = 'Onboarding', isPremiumUser }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* 인증 관련 화면들 */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
        <Stack.Screen name="PurposeSelection" component={PurposeSelectionScreen} />
        <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
        
        {/* 메인 탭 네비게이터 */}
        <Stack.Screen name="Main" component={MainTabNavigator} initialParams={{ isPremiumUser }} />
        
        {/* 설정 관련 화면들 */}
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        
        {/* Obooni 관련 화면들 */}
        <Stack.Screen name="ObooniCustomization" component={ObooniCustomizationScreen} />
        <Stack.Screen name="ObooniCloset" component={ObooniClosetScreen} />
        <Stack.Screen name="ObooniShop" component={ObooniShopScreen} />
        <Stack.Screen name="ObooniOwnedItems" component={ObooniOwnedItemsScreen} />
        
        {/* Album 관련 화면들 */}
        <Stack.Screen name="GrowthAlbum" component={GrowthAlbumScreen} />
        <Stack.Screen name="GrowthAlbumCalendarView" component={GrowthAlbumCalendarView} />
        <Stack.Screen name="GrowthAlbumCategoryView" component={GrowthAlbumCategoryView} />
        
        {/* Pomodoro 관련 화면들 */}
        <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
        <Stack.Screen name="PomodoroTimer" component={PomodoroTimerScreen} />
        <Stack.Screen name="PomodoroGoalSelection" component={PomodoroGoalSelectionScreen} />
        <Stack.Screen name="PomodoroGoalCreation" component={PomodoroGoalCreationScreen} />
        <Stack.Screen name="PomodoroBreakChoice" component={PomodoroBreakChoiceScreen} />
        <Stack.Screen name="PomodoroPause" component={PomodoroPauseScreen} />
        <Stack.Screen name="PomodoroStop" component={PomodoroStopScreen} />
        <Stack.Screen name="PomodoroFinish" component={PomodoroFinishScreen} />
        <Stack.Screen name="PomodoroCycleComplete" component={PomodoroCycleCompleteScreen} />
        
        
        {/* Reminder 관련 화면들 */}
        <Stack.Screen name="Reminder" component={ReminderScreen} />
        <Stack.Screen name="ReminderAddEdit" component={ReminderAddEditScreen} />
        <Stack.Screen name="ReminderChecklist" component={ReminderChecklistScreen} />
        <Stack.Screen name="ReminderLocationSetting" component={ReminderLocationSettingScreen} />
        
        {/* Analysis 관련 화면들 */}
        <Stack.Screen name="AnalysisGraph" component={AnalysisGraphScreen} />
        <Stack.Screen name="DailyAnalysis" component={DailyAnalysisView} />
        <Stack.Screen name="WeeklyAnalysis" component={WeeklyAnalysisView} />
        <Stack.Screen name="MonthlyAnalysis" component={MonthlyAnalysisView} />
        <Stack.Screen name="DDayAnalysis" component={DDayAnalysisView} />
        
        {/* Goal 관련 화면들 */}
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        <Stack.Screen name="GoalDetailV2" component={GoalDetailScreenV2} />
        <Stack.Screen name="GoalScheduleGeneration" component={GoalScheduleGenerationScreen} />
        <Stack.Screen name="GoalScheduleEdit" component={GoalScheduleEditScreen} />
        <Stack.Screen name="GoalRecommendation" component={GoalRecommendationScreen} />
        
        {/* Routine 관련 화면들 */}
        <Stack.Screen name="RoutineSetting" component={RoutineSettingScreen} />
        <Stack.Screen name="RoutineLoading" component={RoutineLoadingScreen} />
        
        {/* 모달 화면들 */}
        <Stack.Screen 
          name="TaskDetailModal" 
          component={TaskDetailModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TaskEditModal" 
          component={TaskEditModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TaskDeleteConfirmModal" 
          component={TaskDeleteConfirmModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TaskCompleteCoinModal" 
          component={TaskCompleteCoinModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="CategorySettingModal" 
          component={CategorySettingModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="CategoryEditModal" 
          component={CategoryEditModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="PhotoUploadModal" 
          component={PhotoUploadModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="PomodoroResetConfirmModal" 
          component={PomodoroResetConfirmModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ReminderTimeSettingModal" 
          component={ReminderTimeSettingModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ReminderLocationAlertModal" 
          component={ReminderLocationAlertModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ReminderCompleteCoinModal" 
          component={ReminderCompleteCoinModal} 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        
        {/* TimeAttack 관련 화면들 */}
        <Stack.Screen 
          name="TimeAttack" 
          component={TimeAttackScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TimeAttackGoalSetting" 
          component={TimeAttackGoalSettingScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TimeAttackAISubdivision" 
          component={TimeAttackAISubdivisionScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TimeAttackInProgress" 
          component={TimeAttackInProgressScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TimeAttackComplete" 
          component={TimeAttackCompleteScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="TimeAttackStop" 
          component={TimeAttackStopScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        
        {/* Task 관련 화면들 */}
        <Stack.Screen 
          name="TaskCalendar" 
          component={TaskCalendarScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="CategorySetting" 
          component={CategorySettingModal} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="CategoryEdit" 
          component={CategoryEditModal} 
          options={{ 
            headerShown: false 
          }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;