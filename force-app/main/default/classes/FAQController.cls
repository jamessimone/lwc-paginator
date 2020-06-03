public class FAQController {

    @AuraEnabled(cacheable = true)
    public static List<FAQ> getFAQs() {
        List<FAQ> faqs = new List<FAQ>();
        for(Integer index = 0; index < 100; index++) {
            String indexString = String.valueOf(index);
            faqs.add(new FAQ('Question for ' + indexString, 'Answer for ' + indexString, indexString));
        }
        return faqs;
    }

    public class FAQ {
        public FAQ(String question, String answer, String key) {
            this.question = question;
            this.answer = answer;
            this.key = key;
        }
        @AuraEnabled
        public String question { get; private set; }
        @AuraEnabled
        public String answer { get; private set; }
        @AuraEnabled
        public String key { get; private set; }
    }
}