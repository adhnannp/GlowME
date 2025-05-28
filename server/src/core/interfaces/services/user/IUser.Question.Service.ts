export interface IUserQuestionService{
    checkTitleAvailablity(title:string) : Promise<boolean>;
}