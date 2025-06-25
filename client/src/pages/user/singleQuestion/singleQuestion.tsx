"use client"

import { useState } from "react"
import { Search, ArrowUp, ArrowDown, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import MDEditor from "@uiw/react-md-editor"
import "@uiw/react-md-editor/markdown-editor.css"

export default function SingleQuestion() {
  const [votes, setVotes] = useState({ question: 18, answer1: 4, answer2: 1 })
  const [yourAnswer, setYourAnswer] = useState("")

  const handleVote = (type: string, direction: "up" | "down") => {
    setVotes((prev) => ({
      ...prev,
      [type]: direction === "up" ? prev[type as keyof typeof prev] + 1 : prev[type as keyof typeof prev] - 1,
    }))
  }

  const answer1Content = `**As you've marked out**, \`final\` - no other class can extend \`final\`.

**As you've marked again**, \`non-sealed\` - any class can extend \`sealed\`.

When marking a class as \`sealed\` - all directly extending classes the ones after the \`permits\` - keyword have to be marked either as \`final\` - \`sealed\` - or \`non-sealed\`.

Marking a class that extends a \`sealed\` - class as \`sealed\` - opens the same effect as 1. Only classes specified after the \`permits\` - clause are allowed to extend it.

Marking a class that extends a \`sealed\` - class as \`final\` - stops the inheritance hierarchy. The extending class is open sealed by being extended by unknown subclasses itself.

Marking a class that extends a \`sealed\` - class as \`non-sealed\` - without any control - classes. Hence that specifying nothing after \`permits\` - is not possible, so \`sealed\` - cannot replace \`final\`.

### Example Code

\`\`\`java
public final class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}
\`\`\``

  const answer2Content = `**Final and non-sealed classes have some differences:**

- **Final class**: you can't inherit this class, it's impossible to extend this class to other class as the other hand.
- **non-sealed class**: it's possible to inherit this class from others.

For example, this sealed interface which interface may permitted for Cat & Duck class. Note that Cat & Duck must be final, non-sealed, or sealed class.

\`\`\`java
public final class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}

public non-sealed class Duck implements Animal {
    @Override  
    public void makeSound() {
        System.out.println("Quack");
    }
}
\`\`\`

Now, I am creating Cat & Duck class. Note that in the final class and another one is non-sealed class.

So that means that subclasses, meaning **no other class can extend it**. Any class can extend the **non-sealed class**.

### Key Differences Summary

| Type | Inheritance | Use Case |
|------|-------------|----------|
| \`final\` | Cannot be extended | Complete restriction |
| \`non-sealed\` | Can be extended freely | Opens inheritance hierarchy |
| \`sealed\` | Only permitted classes can extend | Controlled inheritance |`

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-gray-900">GlowME</div>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-500 text-white text-xs">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Question Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                What is the difference between a final and a non-sealed class in Java 15's sealed-classes feature?
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Asked 4 years, 5 months ago</span>
                <span>Modified today</span>
                <span>Viewed 4k times</span>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex gap-4 mb-8">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote("question", "up")}
                  className="p-1 hover:bg-gray-100"
                >
                  <ArrowUp className="w-6 h-6" />
                </Button>
                <span className="text-xl font-semibold">{votes.question}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote("question", "down")}
                  className="p-1 hover:bg-gray-100"
                >
                  <ArrowDown className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="sm" className="p-1">
                  <Bookmark className="w-5 h-5" />
                </Button>
              </div>

              {/* Question Body */}
              <div className="flex-1">
                <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center">
                  <div className="text-cyan-400">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <path
                        d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm0 20c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="11"
                        ry="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        transform="rotate(60 12 12)"
                      />
                      <ellipse
                        cx="12"
                        cy="12"
                        rx="11"
                        ry="4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        transform="rotate(120 12 12)"
                      />
                      <ellipse cx="12" cy="12" rx="11" ry="4" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  Can someone tell me the difference between <code className="bg-gray-100 px-1 rounded">final</code> and{" "}
                  <code className="bg-gray-100 px-1 rounded">non-sealed</code>? I know - some are from creating other
                  sub-classes but what advantage does <code className="bg-gray-100 px-1 rounded">non-sealed</code> apply
                  to Java 15?
                </p>

                <div className="flex space-x-2 mb-4">
                  <Badge variant="secondary">java</Badge>
                  <Badge variant="secondary">sealed-class</Badge>
                  <Badge variant="secondary">java-15</Badge>
                  <Badge variant="secondary">java-sealed-type</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">AP</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">Adham P</div>
                      <div className="text-gray-500">XP 3000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">3 Answers</h2>

              {/* Answer 1 */}
              <div className="flex gap-4 mb-8 pb-8 border-b">
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("answer1", "up")}
                    className="p-1 hover:bg-gray-100"
                  >
                    <ArrowUp className="w-6 h-6" />
                  </Button>
                  <span className="text-xl font-semibold">{votes.answer1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("answer1", "down")}
                    className="p-1 hover:bg-gray-100"
                  >
                    <ArrowDown className="w-6 h-6" />
                  </Button>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="prose max-w-none" data-color-mode="light">
                    <MDEditor.Markdown
                      source={answer1Content}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Follow
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">AP</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">Adham P</div>
                        <div className="text-gray-500">XP 3000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer 2 */}
              <div className="flex gap-4 mb-8 pb-8 border-b">
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("answer2", "up")}
                    className="p-1 hover:bg-gray-100"
                  >
                    <ArrowUp className="w-6 h-6" />
                  </Button>
                  <span className="text-xl font-semibold">{votes.answer2}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("answer2", "down")}
                    className="p-1 hover:bg-gray-100"
                  >
                    <ArrowDown className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="prose max-w-none" data-color-mode="light">
                    <MDEditor.Markdown
                      source={answer2Content}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm">
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Follow
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">AP</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">Adham P</div>
                        <div className="text-gray-500">XP 3000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Answer Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <div className="mb-4" data-color-mode="light">
                <MDEditor
                  value={yourAnswer}
                  onChange={(val) => setYourAnswer(val || "")}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragBar={false}
                  textareaProps={{
                    placeholder:
                      "Write your answer in Markdown...\n\nYou can use:\n- **bold** and *italic* text\n- `code` blocks\n- Lists and tables\n- Links and images",
                    style: { fontSize: 14, lineHeight: 1.6, minHeight: 200 },
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!yourAnswer.trim()}>
                  Post Your Answer
                </Button>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                  <span>Markdown supported</span>
                </div>
              </div>

              {/* Preview of your answer */}
              {yourAnswer && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <MDEditor.Markdown source={yourAnswer} data-color-mode="light" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Related Questions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">34</div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      What is the difference between a final and a non-sealed class in Java 15's sealed-classes feature?
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">18</div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      What is the point of implementing a sealed class in Java 15?
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">12</div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      How to use sealed classes in Java 15?
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">8</div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Difference between sealed and final classes in Java
                    </a>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">6</div>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Java 15 sealed classes vs abstract classes
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Markdown Guide</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <code className="bg-gray-100 px-1 rounded">**bold**</code> for <strong>bold text</strong>
                  </div>
                  <div>
                    <code className="bg-gray-100 px-1 rounded">*italic*</code> for <em>italic text</em>
                  </div>
                  <div>
                    <code className="bg-gray-100 px-1 rounded">`code`</code> for inline code
                  </div>
                  <div>
                    <code className="bg-gray-100 px-1 rounded">```java</code> for code blocks
                  </div>
                  <div>
                    <code className="bg-gray-100 px-1 rounded">- item</code> for lists
                  </div>
                  <div>
                    <code className="bg-gray-100 px-1 rounded">[link](url)</code> for links
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
