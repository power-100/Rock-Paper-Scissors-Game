# Rock Paper Scissors Game

A modern, interactive browser-based Rock Paper Scissors game built with HTML5, CSS3, and Vanilla JavaScript. Features persistent scoring, auto-play functionality, and a sleek dark-themed interface.

## 🎮 Live Demo
Play the game by opening `index.html` in your web browser.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Presentation   │    │   Styling       │    │   Logic         │
│     Layer       │    │    Layer        │    │   Layer         │
│                 │    │                 │    │                 │
│ • index.html    │◄──►│ • style.css     │◄──►│ • script.js     │
│ • DOM Events    │    │ • Flexbox       │    │ • Game State    │
│ • User Interface│    │ • Responsive    │    │ • LocalStorage  │
│ • Image Assets  │    │ • Dark Theme    │    │ • Event Handling│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GAME COMPONENTS                             │
├─────────────┬─────────────────┬─────────────────┬─────────────────┤
│Game Engine  │ Score Manager   │ Auto-Play       │ UI Controller   │
│             │                 │ System          │                 │
│• Move Logic │ • Win/Loss/Tie  │ • setInterval   │ • DOM Updates   │
│• Random AI  │ • Persistence   │ • State Toggle  │ • Event Binding │
│• Rule Engine│ • JSON Storage  │ • Auto Gaming   │ • Image Display │
└─────────────┴─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────┘

User Input → Game Logic → Score Update → LocalStorage → DOM Update
     ▲                                                        │
     └────────────────── UI Feedback ◄─────────────────────────┘
```

## 🧠 Game Logic Pseudo Code

### Core Game Algorithm
```pseudo
FUNCTION playGame(playerMove):
    computerMove = pickComputerMove()
    result = ""
    
    // Game Logic Matrix
    IF playerMove == "Rock":
        IF computerMove == "Scissors": result = "win"
        ELSE IF computerMove == "Paper": result = "lose"
        ELSE: result = "tie"
    
    ELSE IF playerMove == "Paper":
        IF computerMove == "Rock": result = "win"
        ELSE IF computerMove == "Scissors": result = "lose"
        ELSE: result = "tie"
    
    ELSE IF playerMove == "Scissors":
        IF computerMove == "Paper": result = "win"
        ELSE IF computerMove == "Rock": result = "lose"
        ELSE: result = "tie"
    
    updateScore(result)
    persistScore()
    updateUI(playerMove, computerMove, result)
END FUNCTION

FUNCTION pickComputerMove():
    randomValue = generateRandom(0, 1)
    
    IF randomValue < 1/3: RETURN "Rock"
    ELSE IF randomValue < 2/3: RETURN "Paper"
    ELSE: RETURN "Scissors"
END FUNCTION

FUNCTION updateScore(result):
    IF result == "win": score.wins++
    ELSE IF result == "lose": score.losses++
    ELSE: score.ties++
END FUNCTION
```

### Auto-Play System
```pseudo
FUNCTION autoPlay():
    IF NOT isAutoPlaying:
        intervalId = setInterval(FUNCTION():
            randomMove = pickComputerMove()
            playGame(randomMove)
        END FUNCTION, 1000ms)
        isAutoPlaying = TRUE
    ELSE:
        clearInterval(intervalId)
        isAutoPlaying = FALSE
END FUNCTION
```

## 🎯 Design Decisions & Trade-offs

### **1. Vanilla JavaScript vs Frameworks**
**Decision:** Used Vanilla JavaScript instead of React/Vue
- **Pros:** 
  - Zero dependencies, faster loading
  - Direct DOM manipulation control
  - Educational value for understanding core concepts
- **Cons:**
  - More verbose code
  - Manual DOM updates
- **Trade-off:** Chose simplicity and performance over development convenience

### **2. localStorage for Persistence**
**Decision:** Used browser's localStorage instead of external database
- **Pros:**
  - No server requirements
  - Instant data persistence
  - Works offline
- **Cons:**
  - Data limited to single browser
  - No cross-device synchronization
- **Trade-off:** Prioritized simplicity and offline functionality over multi-device support

### **3. Inline Event Handlers vs Event Listeners**
**Decision:** Mixed approach - inline for game buttons, programmatic for complex logic
- **Pros:**
  - Direct HTML-JS connection for simple actions
  - Easier debugging for basic interactions
- **Cons:**
  - Less separation of concerns
  - Harder to maintain for complex events
- **Trade-off:** Balanced readability with maintainability

### **4. CSS Flexbox Layout**
**Decision:** Used Flexbox for centering and layout
- **Pros:**
  - Modern, flexible layout system
  - Easy vertical/horizontal centering
  - Responsive by nature
- **Cons:**
  - Limited older browser support
- **Trade-off:** Chose modern standards over legacy compatibility

### **5. Uniform Random Distribution**
**Decision:** Used Math.random() with equal 1/3 probability splits
- **Pros:**
  - Fair gameplay
  - Simple implementation
  - Predictable behavior
- **Cons:**
  - No adaptive AI difficulty
  - Potentially predictable patterns
- **Trade-off:** Chose fairness and simplicity over advanced AI features

## 🏛️ Architecture Patterns Used

### **1. Module Pattern (Implicit)**
- Global variables contained within IIFE-like structure
- State encapsulation through closures

### **2. Observer Pattern**
- DOM events trigger state changes
- UI updates respond to state modifications

### **3. Strategy Pattern**
- Game rules implemented as conditional strategies
- Different win/lose/tie outcomes based on move combinations

## 🚀 Features

- **🎲 Interactive Gameplay:** Click buttons to play Rock, Paper, or Scissors
- **🤖 Smart Computer AI:** Random opponent with fair probability distribution
- **📊 Persistent Scoring:** Scores saved across browser sessions using localStorage
- **⚡ Auto-Play Mode:** Watch the game play itself automatically
- **🎨 Modern UI:** Dark theme with smooth interactions and visual feedback
- **📱 Responsive Design:** Works on desktop and mobile devices
- **🖼️ Visual Assets:** Custom icons for each move type

## 🛠️ Technical Implementation

### **File Structure**
```
/
├── index.html          # Main HTML structure
├── style.css          # Styling and layout
├── script.js          # Game logic and interactions
├── assets/            # Game assets
│   ├── Rock.png      # Rock move icon
│   ├── Paper.png     # Paper move icon
│   └── Scissors.png  # Scissors move icon
└── README.md         # This documentation
```

### **Key Components**

1. **Game State Management**
   - Score object with wins/losses/ties
   - localStorage integration for persistence
   - Auto-play state tracking

2. **Game Logic Engine**
   - Rule-based move comparison
   - Random computer move generation
   - Result calculation and scoring

3. **User Interface**
   - Dynamic DOM updates
   - Visual move display
   - Real-time score updates

## 🎮 How to Play

1. **Manual Play:**
   - Click any of the three move buttons (Rock, Paper, Scissors)
   - See your move vs computer's move
   - Watch your score update automatically

2. **Auto-Play:**
   - Click "Auto Play" to start automatic gameplay
   - Game plays itself every second
   - Click "Auto Play" again to stop

3. **Reset:**
   - Click "Reset Score" to clear all statistics
   - Starts fresh game session

## 🔧 Development Insights

### **Code Quality Considerations**
- **Separation of Concerns:** HTML structure, CSS styling, JS logic kept separate
- **State Management:** Centralized score object with clear update patterns
- **Error Handling:** Graceful fallbacks for localStorage unavailability
- **Performance:** Minimal DOM queries, efficient event handling

### **Potential Improvements**
1. **Add sound effects** for better user engagement
2. **Implement difficulty levels** with adaptive AI
3. **Add multiplayer support** via WebSockets
4. **Create game statistics** dashboard with charts
5. **Add animations** for move reveals and transitions

## 📝 Installation & Setup

1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately - no build process required!

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements. Areas for contribution:
- UI/UX enhancements
- Additional game modes
- Performance optimizations
- Accessibility improvements

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Vanilla Web Technologies**
