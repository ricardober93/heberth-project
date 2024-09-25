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
        
        <Box display={'flex'} flexDirection={'column'} textAlign="center" gap={2}>
          <Image 
            src="/ribermudez.jpg"
            alt="Ricardo Bermudez"
            borderRadius="full"
            boxSize="200px"
            objectFit="cover"
            margin="0 auto"
          />
          <Heading as="h2" size="lg" mt={4}>Ricardo Bermudez</Heading>
          <Text fontStyle="italic" color="gray.600">Web Developer | React Enthusiast | Coffee Lover</Text>
        </Box>
        
        <Box>
          <Heading as="h3" size="md">Biography</Heading>
          <Text my={2}>
            Hello! I'm a passionate web developer with 7+ years of experience in building
            modern web applications. I specialize in React and TypeScript, and I love
            creating intuitive user interfaces that solve real-world problems.
          </Text>
        </Box>
        
        <Box>
          <Heading as="h3" size="md">Skills</Heading>
          <UnorderedList styleType="none" display="flex" flexWrap="wrap" padding={0} my={2}>
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
          <Heading as="h3" size="md" mb={2}>Get in Touch</Heading>
          <Text>Email: ribermudez@petalmail.com</Text>
          <Link href="https://www.linkedin.com/in/ricardotellez7/" color="blue.500">LinkedIn: ricardotellez7</Link>
          <Link href="https://github.com/ricardober93" color="blue.500" display="block">GitHub: ricardober93</Link>
        </Box>
      </VStack>
    </Box>
  )
}
