import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "./FeedbackForm";

describe("FeedbackForm", () => {
    // Test 1: Проверка заголовка
    it("should display the feedback form title", () => {
        render(<FeedbackForm />);
        expect(screen.getByText("Обратная связь")).toBeInTheDocument();
    });

    // Test 2: Ввод имени и сообщения
    it("should update input and textarea values when typing", async () => {
        render(<FeedbackForm />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText("Ваше имя");
        const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");

        await user.type(nameInput, "John Doe");
        await user.type(messageTextarea, "Test message");

        expect(nameInput.value).toBe("John Doe");
        expect(messageTextarea.value).toBe("Test message");
    });

    // Test 3: Отправка формы с валидными данными
    it("should show confirmation message after submitting valid form", async () => {
        vi.useFakeTimers();
        render(<FeedbackForm />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText("Ваше имя");
        const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");
        const submitButton = screen.getByText("Отправить");

        await user.type(nameInput, "John Doe");
        await user.type(messageTextarea, "Test message");
        await user.click(submitButton);

        vi.advanceTimersByTime(1500);

        const confirmationMessage = screen.getByText(
            "Спасибо, John Doe! Ваше сообщение отправлено."
        );
        expect(confirmationMessage).toBeInTheDocument();
        vi.useRealTimers();
    });

    // Test 4: Проверка, что сообщение не отправляется при пустом вводе
    it("should not show confirmation message with empty inputs", async () => {
        vi.useFakeTimers();
        render(<FeedbackForm />);
        const user = userEvent.setup();

        const submitButton = screen.getByText("Отправить");
        await user.click(submitButton);

        vi.advanceTimersByTime(1500);

        expect(screen.queryByText(/Спасибо/)).not.toBeInTheDocument();
        vi.useRealTimers();
    });

    // Test 5: Проверка, что кнопка существует и активна
    it("should have an enabled submit button", () => {
        render(<FeedbackForm />);
        const submitButton = screen.getByText("Отправить");
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
    });

    // Test 6: Проверка trim-валидации
    it("should not show confirmation message with whitespace-only inputs", async () => {
        vi.useFakeTimers();
        render(<FeedbackForm />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText("Ваше имя");
        const messageTextarea = screen.getByPlaceholderText("Ваше сообщение");
        const submitButton = screen.getByText("Отправить");

        await user.type(nameInput, "   ");
        await user.type(messageTextarea, "   ");
        await user.click(submitButton);

        vi.advanceTimersByTime(1500);

        expect(screen.queryByText(/Спасибо/)).not.toBeInTheDocument();
        vi.useRealTimers();
    });
});
