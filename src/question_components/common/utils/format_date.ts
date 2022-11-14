export const format_date = (date: string) => {
  let dateString = '';
  if (date) {
    const reviewDate = new Date(Date.parse(date));
    const currentYear = new Date().getFullYear().toString();
    
    let dateWithYear = { month: 'long', day: 'numeric', year: 'numeric' } as const;
    let dateWithoutYear = { month: 'long', day: 'numeric'} as const;

    dateString = reviewDate.toLocaleDateString('en-US', 
      reviewDate.getFullYear().toString() === currentYear ? dateWithoutYear : dateWithYear);
  }
  return dateString;
};
