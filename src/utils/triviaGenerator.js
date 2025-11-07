// Pop Culture Trivia Puzzle Generator
// Supports Easy, Medium, and Hard difficulty levels

const TRIVIA_QUESTIONS = {
  easy: [
    {
      question: "What is the name of the main character in the Harry Potter series?",
      answers: ["Harry Potter", "Hermione Granger", "Ron Weasley", "Draco Malfoy"],
      correctIndex: 0
    },
    {
      question: "Which movie features the quote 'May the Force be with you'?",
      answers: ["Star Wars", "Star Trek", "Guardians of the Galaxy", "The Matrix"],
      correctIndex: 0
    },
    {
      question: "What is the name of the fictional company in 'The Office'?",
      answers: ["Dunder Mifflin", "Staples", "Office Depot", "Paper Company"],
      correctIndex: 0
    },
    {
      question: "Which superhero is known as 'The Man of Steel'?",
      answers: ["Superman", "Iron Man", "Captain America", "Batman"],
      correctIndex: 0
    },
    {
      question: "What is the name of the coffee shop in 'Friends'?",
      answers: ["Central Perk", "Starbucks", "The Coffee Bean", "Café Nervosa"],
      correctIndex: 0
    },
    {
      question: "Which streaming platform created 'Stranger Things'?",
      answers: ["Netflix", "Disney+", "HBO Max", "Amazon Prime"],
      correctIndex: 0
    },
    {
      question: "What is the name of the main character in 'Breaking Bad'?",
      answers: ["Walter White", "Jesse Pinkman", "Saul Goodman", "Hank Schrader"],
      correctIndex: 0
    },
    {
      question: "Which video game features a character named Mario?",
      answers: ["Super Mario Bros", "Sonic the Hedgehog", "The Legend of Zelda", "Pokémon"],
      correctIndex: 0
    },
    {
      question: "What is the name of the school in 'Glee'?",
      answers: ["McKinley High", "Riverdale High", "East High", "West High"],
      correctIndex: 0
    },
    {
      question: "Which band performed 'Bohemian Rhapsody'?",
      answers: ["Queen", "The Beatles", "Led Zeppelin", "Pink Floyd"],
      correctIndex: 0
    }
  ],
  medium: [
    {
      question: "What year did 'The Matrix' premiere?",
      answers: ["1999", "2000", "2001", "1998"],
      correctIndex: 0
    },
    {
      question: "Which actor played Tony Stark in the Marvel Cinematic Universe?",
      answers: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
      correctIndex: 0
    },
    {
      question: "What is the name of the fictional country in 'Wakanda'?",
      answers: ["Wakanda", "Asgard", "Latveria", "Genosha"],
      correctIndex: 0
    },
    {
      question: "Which TV show features the characters Ross, Rachel, and Chandler?",
      answers: ["Friends", "Seinfeld", "How I Met Your Mother", "The Big Bang Theory"],
      correctIndex: 0
    },
    {
      question: "What is the name of the AI assistant in 'Iron Man'?",
      answers: ["JARVIS", "FRIDAY", "Ultron", "Vision"],
      correctIndex: 0
    },
    {
      question: "Which movie features the song 'Eye of the Tiger'?",
      answers: ["Rocky III", "Rocky", "Rocky II", "Creed"],
      correctIndex: 0
    },
    {
      question: "What is the name of the spaceship in 'Firefly'?",
      answers: ["Serenity", "Enterprise", "Millennium Falcon", "Nostromo"],
      correctIndex: 0
    },
    {
      question: "Which video game features the character Master Chief?",
      answers: ["Halo", "Call of Duty", "Battlefield", "Destiny"],
      correctIndex: 0
    },
    {
      question: "What is the name of the fictional newspaper in 'The Daily Planet'?",
      answers: ["The Daily Planet", "The Gotham Gazette", "The Daily Bugle", "The Metropolis Times"],
      correctIndex: 0
    },
    {
      question: "Which streaming service created 'The Mandalorian'?",
      answers: ["Disney+", "Netflix", "HBO Max", "Amazon Prime"],
      correctIndex: 0
    }
  ],
  hard: [
    {
      question: "What is the real name of the Joker in 'The Dark Knight'?",
      answers: ["Unknown/Not revealed", "Jack Napier", "Arthur Fleck", "Jerome Valeska"],
      correctIndex: 0
    },
    {
      question: "Which character said 'I am Iron Man' in the MCU?",
      answers: ["Tony Stark", "Pepper Potts", "War Machine", "Captain America"],
      correctIndex: 0
    },
    {
      question: "What is the name of the fictional element in 'Avatar'?",
      answers: ["Unobtanium", "Adamantium", "Vibranium", "Mithril"],
      correctIndex: 0
    },
    {
      question: "Which TV show features the phrase 'Winter is Coming'?",
      answers: ["Game of Thrones", "The Walking Dead", "Vikings", "The Last Kingdom"],
      correctIndex: 0
    },
    {
      question: "What is the name of the hotel in 'The Grand Budapest Hotel'?",
      answers: ["The Grand Budapest Hotel", "The Continental", "The Plaza", "The Ritz"],
      correctIndex: 0
    },
    {
      question: "Which movie features the quote 'I'll be back'?",
      answers: ["The Terminator", "Predator", "Commando", "Total Recall"],
      correctIndex: 0
    },
    {
      question: "What is the name of the AI in 'Her'?",
      answers: ["Samantha", "Alexa", "Siri", "Cortana"],
      correctIndex: 0
    },
    {
      question: "Which video game series features the character Geralt of Rivia?",
      answers: ["The Witcher", "Elder Scrolls", "Dark Souls", "Dragon Age"],
      correctIndex: 0
    },
    {
      question: "What is the name of the fictional drug in 'Breaking Bad'?",
      answers: ["Blue Meth", "Crystal Blue", "Blue Sky", "The Blue"],
      correctIndex: 0
    },
    {
      question: "Which movie features the character Dom Cobb?",
      answers: ["Inception", "Interstellar", "The Prestige", "Memento"],
      correctIndex: 0
    }
  ]
}

/**
 * Generate a pop culture trivia puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Puzzle object with question, answers, correctIndex, timeLimit, points
 */
export function generateTriviaPuzzle(difficulty) {
  const questions = TRIVIA_QUESTIONS[difficulty] || TRIVIA_QUESTIONS.easy
  const selected = questions[Math.floor(Math.random() * questions.length)]
  
  const points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 60
  const timeLimit = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60
  
  // Format answers
  const answers = selected.answers.map((text, index) => ({
    letter: String.fromCharCode(65 + index), // A, B, C, D
    text,
    isCorrect: index === selected.correctIndex
  }))
  
  return {
    type: 'trivia',
    difficulty,
    question: selected.question,
    answers,
    correctIndex: selected.correctIndex,
    timeLimit,
    points
  }
}


