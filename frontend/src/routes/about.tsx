import { Box, Heading, Text, VStack, Image, Link, UnorderedList, ListItem } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <Box maxWidth="800px" margin="0 auto" padding="2rem">
      <VStack spacing={8} align="stretch">
        <Heading as="h1">About Me</Heading>
        
        <Box textAlign="center">
          <Image 
            src="/path/to/your/profile-picture.jpg" 
            alt="Your Name" 
            borderRadius="full"
            boxSize="200px"
            objectFit="cover"
            margin="0 auto"
          />
          <Heading as="h2" size="lg" mt={4}>Your Name</Heading>
          <Text fontStyle="italic" color="gray.600">Web Developer | React Enthusiast | Coffee Lover</Text>
        </Box>
        
        <Box>
          <Heading as="h3" size="md">Biography</Heading>
          <Text>
            Hello! I'm a passionate web developer with X years of experience in building
            modern web applications. I specialize in React and TypeScript, and I love
            creating intuitive user interfaces that solve real-world problems.
          </Text>
        </Box>
        
        <Box>
          <Heading as="h3" size="md">Skills</Heading>
          <UnorderedList styleType="none" display="flex" flexWrap="wrap" padding={0}>
            {['React', 'TypeScript', 'HTML/CSS', 'Node.js', 'Git'].map((skill) => (
              <ListItem 
                key={skill} 
                bg="gray.100" 
                px={3} 
                py={1} 
                borderRadius="full" 
                mr={2} 
                mb={2}
              >
                {skill}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
        
        <Box>
          <Heading as="h3" size="md">Get in Touch</Heading>
          <Text>Email: your.email@example.com</Text>
          <Link href="https://www.linkedin.com/in/yourprofile" color="blue.500">LinkedIn: linkedin.com/in/yourprofile</Link>
          <Link href="https://github.com/yourusername" color="blue.500" display="block">GitHub: github.com/yourusername</Link>
        </Box>
      </VStack>
    </Box>
  )
}
