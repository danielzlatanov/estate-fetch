import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  faqItemsLeft = [
    {
      question: 'What is Estate Fetch?',
      answer:
        'A powerful web scraping tool designed to efficiently gather real estate data from online sources and provide you with the saved data.',
    },

    {
      question: 'How does it work?',
      answer:
        'It uses advanced web scraping techniques to extract property information from websites, giving you up-to-date data.',
    },
    {
      question: 'What kind of real estate data can I access?',
      answer:
        'Estate Fetch allows you to access a wide range of real estate data, including property details, images, and more.',
    },
    {
      question: 'What types of websites can Estate Fetch scrape data from?',
      answer:
        'Currently, it is capable of scraping data from imot.bg, one of the largest real estate websites in Bulgaria. We are actively working on expanding our sources.',
    },
  ];
  faqItemsRight = [
    {
      question: 'Does it handle errors and interruptions?',
      answer:
        'Absolutely. Estate Fetch includes a reliable error handling system and a retry mechanism to ensure uninterrupted data retrieval.',
    },
    {
      question:
        'How often is it updated to stay compatible with website changes?',
      answer:
        'It is regularly updated to adapt to source changes, ensuring consistent data extraction.',
    },
    {
      question: 'Is it compatible with my browser and operating system?',
      answer:
        'It is designed to work seamlessly across different browsers and operating systems for your ease.',
    },
    {
      question: 'Is it suitable for professionals and beginners?',
      answer:
        'Yes, it is easy to use for both experienced users and beginners, thanks to its user-friendly design.',
    },
  ];
  showAnswerLeft: boolean[] = Array(this.faqItemsLeft.length).fill(false);
  showAnswerRight: boolean[] = Array(this.faqItemsRight.length).fill(false);

  toggleAnswer(index: number, col: string) {
    if (col === 'left') {
      this.showAnswerLeft[index] = !this.showAnswerLeft[index];
    } else if (col === 'right') {
      this.showAnswerRight[index] = !this.showAnswerRight[index];
    }
  }
}
