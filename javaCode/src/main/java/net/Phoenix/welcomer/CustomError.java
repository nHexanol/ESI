package net.Phoenix.welcomer;

public class CustomError extends Exception{
    public CustomError(String errorMessage) {
        System.out.println("Phoenix error :\n"  + errorMessage);
    }
    public CustomError() {
        System.out.println("Phoenix error has been called");
    }
}
