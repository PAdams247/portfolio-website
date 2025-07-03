# Python Game Examples

This document shows what the original Python versions of these games might look like using Pygame.

## Snake Game (Python/Pygame Version)

```python
import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 600
WINDOW_HEIGHT = 600
CELL_SIZE = 20
CELL_NUMBER = WINDOW_WIDTH // CELL_SIZE

# Colors
BLACK = (0, 0, 0)
GREEN = (46, 213, 115)
RED = (255, 71, 87)
WHITE = (255, 255, 255)

class Snake:
    def __init__(self):
        self.body = [pygame.Vector2(5, 10), pygame.Vector2(4, 10), pygame.Vector2(3, 10)]
        self.direction = pygame.Vector2(1, 0)
        self.new_block = False

    def draw_snake(self, screen):
        for block in self.body:
            x_pos = int(block.x * CELL_SIZE)
            y_pos = int(block.y * CELL_SIZE)
            block_rect = pygame.Rect(x_pos, y_pos, CELL_SIZE, CELL_SIZE)
            pygame.draw.rect(screen, GREEN, block_rect)

    def move_snake(self):
        if self.new_block:
            body_copy = self.body[:]
            body_copy.insert(0, body_copy[0] + self.direction)
            self.body = body_copy[:]
            self.new_block = False
        else:
            body_copy = self.body[:-1]
            body_copy.insert(0, body_copy[0] + self.direction)
            self.body = body_copy[:]

    def add_block(self):
        self.new_block = True

    def check_collision(self):
        # Check wall collision
        if not 0 <= self.body[0].x < CELL_NUMBER or not 0 <= self.body[0].y < CELL_NUMBER:
            return True
        
        # Check self collision
        for block in self.body[1:]:
            if block == self.body[0]:
                return True
        
        return False

class Food:
    def __init__(self):
        self.randomize()

    def draw_food(self, screen):
        food_rect = pygame.Rect(int(self.pos.x * CELL_SIZE), int(self.pos.y * CELL_SIZE), CELL_SIZE, CELL_SIZE)
        pygame.draw.rect(screen, RED, food_rect)

    def randomize(self):
        self.x = random.randint(0, CELL_NUMBER - 1)
        self.y = random.randint(0, CELL_NUMBER - 1)
        self.pos = pygame.Vector2(self.x, self.y)

class Game:
    def __init__(self):
        self.snake = Snake()
        self.food = Food()
        self.score = 0

    def update(self):
        self.snake.move_snake()
        self.check_collision()
        self.check_fail()

    def draw_elements(self, screen):
        screen.fill(BLACK)
        self.food.draw_food(screen)
        self.snake.draw_snake(screen)

    def check_collision(self):
        if self.food.pos == self.snake.body[0]:
            self.food.randomize()
            self.snake.add_block()
            self.score += 10

    def check_fail(self):
        if self.snake.check_collision():
            self.game_over()

    def game_over(self):
        pygame.quit()
        sys.exit()

def main():
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    pygame.display.set_caption('Snake Game')
    clock = pygame.time.Clock()
    game = Game()

    SCREEN_UPDATE = pygame.USEREVENT
    pygame.time.set_timer(SCREEN_UPDATE, 150)

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == SCREEN_UPDATE:
                game.update()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP:
                    if game.snake.direction.y != 1:
                        game.snake.direction = pygame.Vector2(0, -1)
                if event.key == pygame.K_DOWN:
                    if game.snake.direction.y != -1:
                        game.snake.direction = pygame.Vector2(0, 1)
                if event.key == pygame.K_RIGHT:
                    if game.snake.direction.x != -1:
                        game.snake.direction = pygame.Vector2(1, 0)
                if event.key == pygame.K_LEFT:
                    if game.snake.direction.x != 1:
                        game.snake.direction = pygame.Vector2(-1, 0)

        game.draw_elements(screen)
        pygame.display.update()
        clock.tick(60)

if __name__ == '__main__':
    main()
```

## Pong Game (Python/Pygame Version)

```python
import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 400
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 80
BALL_SIZE = 8
PADDLE_SPEED = 6
BALL_SPEED_X = 4
BALL_SPEED_Y = 4

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
CYAN = (0, 212, 255)
RED = (255, 71, 87)

class Paddle:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = PADDLE_WIDTH
        self.height = PADDLE_HEIGHT
        self.speed = PADDLE_SPEED

    def draw(self, screen):
        pygame.draw.rect(screen, CYAN, (self.x, self.y, self.width, self.height))

    def move_up(self):
        if self.y > 0:
            self.y -= self.speed

    def move_down(self):
        if self.y < WINDOW_HEIGHT - self.height:
            self.y += self.speed

class Ball:
    def __init__(self):
        self.x = WINDOW_WIDTH // 2
        self.y = WINDOW_HEIGHT // 2
        self.size = BALL_SIZE
        self.speed_x = BALL_SPEED_X
        self.speed_y = BALL_SPEED_Y

    def draw(self, screen):
        pygame.draw.circle(screen, RED, (int(self.x), int(self.y)), self.size)

    def move(self):
        self.x += self.speed_x
        self.y += self.speed_y

    def bounce_y(self):
        self.speed_y = -self.speed_y

    def bounce_x(self):
        self.speed_x = -self.speed_x

    def reset(self):
        self.x = WINDOW_WIDTH // 2
        self.y = WINDOW_HEIGHT // 2
        self.speed_x = BALL_SPEED_X if self.speed_x > 0 else -BALL_SPEED_X

class Game:
    def __init__(self):
        self.left_paddle = Paddle(20, WINDOW_HEIGHT // 2 - PADDLE_HEIGHT // 2)
        self.right_paddle = Paddle(WINDOW_WIDTH - 30, WINDOW_HEIGHT // 2 - PADDLE_HEIGHT // 2)
        self.ball = Ball()
        self.left_score = 0
        self.right_score = 0
        self.font = pygame.font.Font(None, 74)

    def update(self):
        self.ball.move()
        self.check_collisions()

    def check_collisions(self):
        # Ball collision with top and bottom walls
        if self.ball.y <= self.ball.size or self.ball.y >= WINDOW_HEIGHT - self.ball.size:
            self.ball.bounce_y()

        # Ball collision with paddles
        if (self.ball.x <= self.left_paddle.x + self.left_paddle.width and
            self.left_paddle.y <= self.ball.y <= self.left_paddle.y + self.left_paddle.height):
            self.ball.bounce_x()

        if (self.ball.x >= self.right_paddle.x and
            self.right_paddle.y <= self.ball.y <= self.right_paddle.y + self.right_paddle.height):
            self.ball.bounce_x()

        # Ball goes out of bounds
        if self.ball.x < 0:
            self.right_score += 1
            self.ball.reset()
        elif self.ball.x > WINDOW_WIDTH:
            self.left_score += 1
            self.ball.reset()

    def draw(self, screen):
        screen.fill(BLACK)
        
        # Draw center line
        pygame.draw.aaline(screen, WHITE, (WINDOW_WIDTH // 2, 0), (WINDOW_WIDTH // 2, WINDOW_HEIGHT))
        
        # Draw paddles and ball
        self.left_paddle.draw(screen)
        self.right_paddle.draw(screen)
        self.ball.draw(screen)
        
        # Draw scores
        left_text = self.font.render(str(self.left_score), True, WHITE)
        right_text = self.font.render(str(self.right_score), True, WHITE)
        screen.blit(left_text, (WINDOW_WIDTH // 4, 50))
        screen.blit(right_text, (3 * WINDOW_WIDTH // 4, 50))

def main():
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    pygame.display.set_caption('Pong Game')
    clock = pygame.time.Clock()
    game = Game()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Handle continuous key presses
        keys = pygame.key.get_pressed()
        if keys[pygame.K_w]:
            game.left_paddle.move_up()
        if keys[pygame.K_s]:
            game.left_paddle.move_down()
        if keys[pygame.K_UP]:
            game.right_paddle.move_up()
        if keys[pygame.K_DOWN]:
            game.right_paddle.move_down()

        game.update()
        game.draw(screen)
        pygame.display.flip()
        clock.tick(60)

if __name__ == '__main__':
    main()
```

## Key Differences: Python vs Web Implementation

### Python/Pygame Version:
- **Direct pixel manipulation**: Uses Pygame's drawing functions
- **Game loop**: Traditional game loop with event handling
- **Performance**: Native performance, direct hardware access
- **Installation**: Requires Python and Pygame installation
- **Distribution**: Needs to be packaged as executable

### Web/React Version:
- **DOM/Canvas rendering**: Uses HTML5 Canvas or DOM elements
- **React lifecycle**: Uses React hooks and state management
- **Performance**: Browser-based, optimized with requestAnimationFrame
- **Installation**: No installation required, runs in browser
- **Distribution**: Easily shareable via URL

### Advantages of Web Implementation:
1. **Accessibility**: No installation required
2. **Cross-platform**: Works on any device with a browser
3. **Easy sharing**: Just send a link
4. **Modern UI**: Can leverage CSS for beautiful styling
5. **Responsive design**: Adapts to different screen sizes

Both implementations demonstrate the same core game development concepts:
- Game loops and state management
- Collision detection
- User input handling
- Object-oriented design
- Real-time rendering