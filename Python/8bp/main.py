import pygame
import math
import sys
import os
os.chdir('assets')

pygame.init()
vec = pygame.Vector2
#init screen
SCREEN_WIDTH = pygame.display.Info().current_w * 3/4
SCREEN_HEIGHT = pygame.display.Info().current_h * 3/4
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Billiards")

def roundvec(vector):
    return vec(round(vector[0],0), round(vector[1],0))

#clock
# clock = pygame.time.Clock()
FPS = 60*1

# Collision Physics
def Collide(ball1, ball2):
    # print(ball1.num,ball2.num)
        # if pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):

        #     for ball in pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):

    # while ball2 in pygame.sprite.spritecollide(ball1, balls, False,pygame.sprite.collide_circle):

    #     ball1.pos -= ball1.vel/10
    #     ball1.rect.center = ball1.pos
    #     # print(f"ball with cue ball:{self.vel}")

    while ball1.pos.distance_to(ball2.pos) < ball1.radius + ball2.radius:
        ball1.pos -= ball1.vel/10
        print(ball1.vel)
        print(ball1.num,ball2.num)
    skew = -math.degrees(math.atan2(ball1.vel.y - ball2.vel.y, ball1.vel.x - ball2.vel.x))
    normal = 180 - math.degrees(math.atan2((ball1.pos - ball2.pos).y, (ball1.pos - ball2.pos).x))
    theta = normal - skew


    v_1 = math.sqrt((ball1.vel.x - ball2.vel.x) ** 2 + (ball1.vel.y - ball2.vel.y) ** 2 )

    v_1p = abs(math.sin(math.radians(theta)) * v_1)
    v_2p = abs(math.cos(math.radians(theta)) * v_1)
    v_2px = ball2.vel.x + math.cos(math.radians(normal)) * v_2p
    v_2py = ball2.vel.y - math.sin(math.radians(normal)) * v_2p
    print("collision")
    print(f"total velocity: {v_1}, velocity components: {ball1.vel.x, ball1.vel.y}")
    print(f"skew: {skew}, normal: {normal}, theta: {theta}")
    print(f"final velocities: {v_1p, v_2p}")
    print(f"final v components: {v_2px , v_2py}")
    print(f"final v_1: {(ball2.vel.x + ball1.vel.x) - v_2px, (ball2.vel.y + ball1.vel.y) - v_2py}, final v_2: {v_2px, v_2py}")
    print(vec( (ball2.vel.x + ball1.vel.x) - v_2px, (ball2.vel.y + ball1.vel.y) - v_2py) + vec(v_2px, v_2py))
    return(vec( (ball2.vel.x + ball1.vel.x) - v_2px, (ball2.vel.y + ball1.vel.y) - v_2py),vec(v_2px, v_2py))


    # fine tune normal if this error becomes too pronounced

    print(f"relative angle: {math.degrees(math.atan2(ball1.vel[0] + x_impulse, ball1.vel[1] + y_impulse)) + math.degrees(math.atan2(ball2.vel[0] + -x_impulse, ball2.vel[1] + y_impulse))}")


# init FPS
class FPS_counter:
    def __init__(self):
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("Verdana", 12)
    def render(self, display):
        if round(self.clock.get_fps(),1) > FPS:
            self.text = self.font.render(str(f"{FPS}"), True, "white")
        else:
            self.text = self.font.render(str(round(self.clock.get_fps(),1)), True, "orange")
        display.blit(self.text, (0,0))

fps = FPS_counter()

# init Cue_Ball
class CueBall(pygame.sprite.Sprite):
    def __init__(self, pos):
        super().__init__()
        self.pos = vec(pos)
        self.vel = vec((0.2 * 0,-0.05 * 0))
        self.num = "c"
        self.ticker = 0
        self.colour = "white"
        self.mass = 10
        # self.rect = self.image.get_rect(center=pos)
        # self.image = pygame.Surface((20,)*2)
        self.image = pygame.image.load('ball.png').convert_alpha()
        self.radius = self.image.get_height()/2
        # self.image.fill(self.colour)
        self.rect = self.image.get_rect(center=pos)
    def update(self):
        if pygame.mouse.get_pressed()[0]:
            self.vel = 2 * vec( (pygame.mouse.get_pos()[0] - self.rect.center[0])/70, (pygame.mouse.get_pos()[1] - self.rect.center[1])/70)

        self.pos += self.vel
        self.rect.center = (self.pos)
        self.collide()
        pygame.draw.line(screen,"white",self.pos,pygame.mouse.get_pos())

    def collide(self):

        # if pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):
        #     for ball in pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):

        for ball in balls:
            if self.pos.distance_to(ball.pos) < self.radius + ball.radius and self.vel != vec(0,0):
                self.vel, ball.vel = Collide(self, ball)


            # self.vel, ball.vel = Collide(self, ball)

cue_ball = pygame.sprite.GroupSingle()
cue_ball.add(CueBall((360,200+30)))


# init Ball
class Ball(pygame.sprite.Sprite):
    def __init__(self, pos, vel, num):
        super().__init__()
        self.pos = vec(pos)
        self.vel = vec(vel)
        self.num = num
        self.mass = 10
        self.colour = "black"
        self.image = pygame.image.load('ball.png').convert_alpha()
        self.radius = self.image.get_height()/2
        self.rect = self.image.get_rect(center=pos)
        
    def update(self):
        self.pos += self.vel
        self.rect.center = (self.pos)


        # if len(pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle)) >= 2:
        #     for ball in pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):
        #         if ball != self:

        # if len(pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle)) >= 2:
        #     while len(pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle)) >= 2:
        #         self.pos -= self.vel/100
        #         self.rect.center = (self.pos)
        #     self.pos += self.vel/100
        #     self.rect.center = (self.pos)
        #     for ball in pygame.sprite.spritecollide(self,balls,False,pygame.sprite.collide_circle):
        #         if ball != self:

        for ball in balls:
            if ball != self and self.vel != vec(0,0):
                if self.pos.distance_to(ball.pos) < self.radius + ball.radius:
                    self.vel, ball.vel = Collide(self, ball)



        # if pygame.sprite.spritecollide(self,cue_ball,False,pygame.sprite.collide_circle):
        #     for ball in pygame.sprite.spritecollide(self,cue_ball,False,pygame.sprite.collide_circle):

        for ball in cue_ball:
            if self.pos.distance_to(ball.pos) < self.radius + ball.radius and self.vel != vec(0,0):
                self.vel, ball.vel = Collide(self, ball)

class Cushion(pygame.sprite.Sprite):
    def __init__(self, pos,):
        super().__init__()
        self.pos = vec(pos)

        self.mass = 100
        self.colour = "black"
        self.image = pygame.image.load('ball.png').convert_alpha()
        self.radius = self.image.get_height()/2
        self.rect = self.image.get_rect(center=pos)
        
    def update(self):
        self.pos += self.vel
        self.rect.center = (self.pos)





balls = pygame.sprite.Group()

for i in range(5):
    for k in range(i+1):
        balls.add(Ball((400+ (i*30/2)*(3**(1/2)),200+ k*30 - 15*i),(0,0),i+1))


# balls.add(Ball((400,400), (0,0), 1))
# balls.add(Ball((415,217), (0,0), 2))


#init gameloop
run = True
while run:
    screen.fill("grey")

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False

    # Update
    cue_ball.update()
    balls.update()


    # Draw


    fps.render(screen)

    cue_ball.draw(screen)
    balls.draw(screen)

    pygame.display.update()
    fps.clock.tick(FPS)
    

pygame.quit()
# print(SCREEN_WIDTH,SCREEN_HEIGHT)
